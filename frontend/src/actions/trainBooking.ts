"use server";

import { redirect } from "next/navigation";
import { getSeatProblem, toLocalIsoDate, toTrainQuery } from "@/lib";
import { bookingSchema, flightSearchSchema, trainBookingTripSchema } from "@/schemas";
import { createTrainBooking, getTrainOffer } from "@/services";
import type { FormState } from "@/types";

export const createTrainBookingAction = async (tripInput: unknown, values: unknown): Promise<FormState> => {
  const details = bookingSchema.safeParse(values);
  const trip = trainBookingTripSchema.safeParse(tripInput);

  if (!details.success || !trip.success) {
    return { message: "Check your details and try again." };
  }

  const { offerId, ...search } = trip.data;

  if (!flightSearchSchema.safeParse(search).success) {
    return { message: "Check your details and try again." };
  }

  // Compare against yesterday so travelers ahead of the server's time zone can still book today.
  if (search.departDate < toLocalIsoDate(new Date(Date.now() - 86_400_000))) {
    return { message: "Your departure date has passed. Choose new dates." };
  }

  // The train and the price always come from our own data, never from the browser.
  const offer = await getTrainOffer(search, offerId);

  if (!offer) {
    return { message: "This train is no longer available." };
  }

  const seatProblem = getSeatProblem(offer, search);

  if (seatProblem) {
    return { message: seatProblem };
  }

  const { firstName, lastName, email, phone } = details.data;
  let reference: string;

  try {
    ({ reference } = await createTrainBooking({
      ...trip.data,
      firstName,
      lastName,
      email,
      phone,
      total: Number(offer.totalPrice),
      currency: offer.currency,
    }));
  } catch {
    return { message: "We could not complete your booking. Please try again." };
  }

  const query = new URLSearchParams(toTrainQuery(search));

  query.set("offer", offerId);
  query.set("reference", reference);

  redirect(`/trains/book/confirmed?${query}`);
};
