"use server";

import { redirect } from "next/navigation";
import { toCarQuery, toLocalIsoDate } from "@/lib";
import { carBookingTripSchema, carSearchSchema, createCarBookingSchema } from "@/schemas";
import { createCarBooking, getCarOffer } from "@/services";
import type { FormState } from "@/types";

export const createCarBookingAction = async (tripInput: unknown, values: unknown): Promise<FormState> => {
  const trip = carBookingTripSchema.safeParse(tripInput);

  if (!trip.success) {
    return { message: "Check your details and try again." };
  }

  const { offerId, ...search } = trip.data;
  const details = createCarBookingSchema(search.pickupDate, search.isStandardAge).safeParse(values);
  const isValidRental = carSearchSchema.safeParse({
    ...search,
    hasDifferentDropoff: Boolean(search.dropoffLocation),
  }).success;

  if (!details.success || !isValidRental) {
    return { message: "Check your details and try again." };
  }

  // Compare against yesterday so drivers ahead of the server's time zone can still book today.
  if (search.pickupDate < toLocalIsoDate(new Date(Date.now() - 86_400_000))) {
    return { message: "Your pick-up date has passed. Choose new dates." };
  }

  // The car and the price always come from our own data, never from the browser.
  const offer = await getCarOffer(search, offerId);

  if (!offer) {
    return { message: "This car is no longer available." };
  }

  const { firstName, lastName, birthDate, email, phone } = details.data;
  let reference: string;

  try {
    ({ reference } = await createCarBooking({
      ...trip.data,
      firstName,
      lastName,
      birthDate,
      email,
      phone,
      total: Number(offer.totalPrice),
      currency: offer.currency,
    }));
  } catch {
    return { message: "We could not complete your booking. Please try again." };
  }

  const query = new URLSearchParams(toCarQuery(search));

  query.set("offer", offerId);
  query.set("reference", reference);

  redirect(`/cars/book/confirmed?${query}`);
};
