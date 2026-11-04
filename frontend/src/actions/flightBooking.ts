"use server";

import { redirect } from "next/navigation";
import { getPassengerSlots, getSeatProblem, toFlightQuery, toLocalIsoDate } from "@/lib";
import { createFlightBookingSchema, flightBookingTripSchema, flightSearchSchema } from "@/schemas";
import { createFlightBooking, getFlightOffer } from "@/services";
import type { FormState } from "@/types";

export const createFlightBookingAction = async (tripInput: unknown, values: unknown): Promise<FormState> => {
  const trip = flightBookingTripSchema.safeParse(tripInput);

  if (!trip.success) {
    return { message: "Check your details and try again." };
  }

  const { offerId, ...search } = trip.data;
  const details = createFlightBookingSchema(search.adults, search.children, search.departDate).safeParse(values);

  if (!details.success || !flightSearchSchema.safeParse(search).success) {
    return { message: "Check your details and try again." };
  }

  // Compare against yesterday so travelers ahead of the server's time zone can still book today.
  if (search.departDate < toLocalIsoDate(new Date(Date.now() - 86_400_000))) {
    return { message: "Your departure date has passed. Choose new dates." };
  }

  // The flight and the price always come from our own data, never from the browser.
  const offer = await getFlightOffer(search, offerId);

  if (!offer) {
    return { message: "This flight is no longer available." };
  }

  const seatProblem = getSeatProblem(offer, search);

  if (seatProblem) {
    return { message: seatProblem };
  }

  const fields = details.data as Record<string, string>;
  let reference: string;

  try {
    ({ reference } = await createFlightBooking({
      ...trip.data,
      passengers: getPassengerSlots(search.adults, search.children).map(({ key, type }) => ({
        type,
        firstName: fields[`${key}FirstName`],
        lastName: fields[`${key}LastName`],
        birthDate: fields[`${key}BirthDate`],
      })),
      email: fields.email,
      phone: fields.phone,
      total: Number(offer.totalPrice),
      currency: offer.currency,
    }));
  } catch {
    return { message: "We could not complete your booking. Please try again." };
  }

  const query = new URLSearchParams(toFlightQuery(search));

  query.set("offer", offerId);
  query.set("reference", reference);

  redirect(`/flights/book/confirmed?${query}`);
};
