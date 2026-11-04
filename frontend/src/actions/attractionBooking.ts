"use server";

import { redirect } from "next/navigation";
import { getTicketTotal, toLocalIsoDate } from "@/lib";
import { attractionBookingTripSchema, bookingSchema } from "@/schemas";
import { createAttractionBooking, getAttractionBySlug } from "@/services";
import type { FormState } from "@/types";

export const createAttractionBookingAction = async (tripInput: unknown, values: unknown): Promise<FormState> => {
  const details = bookingSchema.safeParse(values);
  const trip = attractionBookingTripSchema.safeParse(tripInput);

  if (!details.success || !trip.success) {
    return { message: "Check your details and try again." };
  }

  // Compare against yesterday so visitors ahead of the server's time zone can still book today.
  if (trip.data.date < toLocalIsoDate(new Date(Date.now() - 86_400_000))) {
    return { message: "Your visit date has passed. Choose a new date." };
  }

  const attraction = await getAttractionBySlug(trip.data.slug);

  // The ticket and the price always come from our own data, never from the browser.
  const ticket = attraction?.tickets.find((item) => item.id === trip.data.ticketId);

  if (!attraction || !ticket) {
    return { message: "This ticket is no longer available." };
  }

  const { firstName, lastName, email, phone } = details.data;
  let reference: string;

  try {
    ({ reference } = await createAttractionBooking({
      ...trip.data,
      firstName,
      lastName,
      email,
      phone,
      total: getTicketTotal(ticket, trip.data),
      currency: attraction.currency,
    }));
  } catch {
    return { message: "We could not complete your booking. Please try again." };
  }

  const { slug, ticketId, date, adults, children } = trip.data;
  const query = new URLSearchParams({
    ticket: ticketId,
    date,
    adults: String(adults),
    children: String(children),
    reference,
  });

  redirect(`/attractions/${slug}/book/confirmed?${query}`);
};
