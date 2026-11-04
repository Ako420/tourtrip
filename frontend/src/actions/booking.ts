"use server";

import { redirect } from "next/navigation";
import { checkRoom, getStayTotal, toLocalIsoDate, toSearchQuery } from "@/lib";
import { bookingSchema, bookingStaySchema } from "@/schemas";
import { createBooking, getHotelBySlug } from "@/services";
import type { FormState } from "@/types";

export const createBookingAction = async (stayInput: unknown, values: unknown): Promise<FormState> => {
  const details = bookingSchema.safeParse(values);
  const stay = bookingStaySchema.safeParse(stayInput);

  if (!details.success || !stay.success) {
    return { message: "Check your details and try again." };
  }

  const hotel = await getHotelBySlug(stay.data.slug);

  if (!hotel) {
    return { message: "This hotel could not be found." };
  }

  // Compare against yesterday so guests ahead of the server's time zone can still book today.
  const yesterday = toLocalIsoDate(new Date(Date.now() - 86_400_000));

  if (stay.data.checkIn < yesterday) {
    return { message: "Your check-in date has passed. Choose new dates." };
  }

  // The room and the price always come from our own data, never from the browser.
  const { room, problem } = checkRoom(hotel, stay.data.roomId, stay.data);

  if (!room) {
    return { message: problem };
  }

  const guest = bookingSchema.omit({ acceptTerms: true }).parse(details.data);
  let reference: string;

  try {
    ({ reference } = await createBooking({
      ...guest,
      ...stay.data,
      total: getStayTotal(room, stay.data),
      currency: hotel.currency,
    }));
  } catch {
    return { message: "We could not complete your booking. Please try again." };
  }

  const { slug, roomId, ...search } = stay.data;
  const query = new URLSearchParams(toSearchQuery(search));

  query.set("room", roomId);
  query.set("reference", reference);

  redirect(`/hotels/${slug}/book/confirmed?${query}`);
};
