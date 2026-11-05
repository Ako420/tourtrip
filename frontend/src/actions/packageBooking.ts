"use server";

import { redirect } from "next/navigation";
import { getPassengerSlots, toLocalIsoDate, toPackageQuery } from "@/lib";
import { createFlightBookingSchema, packageBookingTripSchema, packageSearchSchema } from "@/schemas";
import { createPackageBooking, getPackageOffer } from "@/services";
import type { FormState } from "@/types";

export const createPackageBookingAction = async (tripInput: unknown, values: unknown): Promise<FormState> => {
  const trip = packageBookingTripSchema.safeParse(tripInput);

  if (!trip.success) {
    return { message: "Check your details and try again." };
  }

  const { flightId, hotelSlug, roomId, ...search } = trip.data;
  const details = createFlightBookingSchema(search.adults, search.children, search.departDate).safeParse(values);

  if (!details.success || !packageSearchSchema.safeParse(search).success) {
    return { message: "Check your details and try again." };
  }

  // Compare against yesterday so travelers ahead of the server's time zone can still book today.
  if (search.departDate < toLocalIsoDate(new Date(Date.now() - 86_400_000))) {
    return { message: "Your departure date has passed. Choose new dates." };
  }

  // The flight, the room and the price always come from our own data, never from the browser.
  const offer = await getPackageOffer(search, { flightId, hotelSlug, roomId });

  if (!offer) {
    return { message: "This package is no longer available." };
  }

  const fields = details.data as Record<string, string>;
  let reference: string;

  try {
    ({ reference } = await createPackageBooking({
      ...trip.data,
      passengers: getPassengerSlots(search.adults, search.children).map(({ key, type }) => ({
        type,
        firstName: fields[`${key}FirstName`],
        lastName: fields[`${key}LastName`],
        birthDate: fields[`${key}BirthDate`],
      })),
      email: fields.email,
      phone: fields.phone,
      total: offer.totalPrice,
      currency: offer.currency,
    }));
  } catch {
    return { message: "We could not complete your booking. Please try again." };
  }

  const query = new URLSearchParams(toPackageQuery(search));

  query.set("flight", flightId);
  query.set("hotel", hotelSlug);
  query.set("room", roomId);
  query.set("reference", reference);

  redirect(`/packages/book/confirmed?${query}`);
};
