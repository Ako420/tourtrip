"use server";

import { bookingLookupSchema } from "@/schemas";
import { findBooking } from "@/services";
import type { BookingLookupState } from "@/types";

export const findBookingAction = async (_state: BookingLookupState, values: unknown): Promise<BookingLookupState> => {
  const result = bookingLookupSchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  if (result.data.reference.startsWith("DEMO-")) {
    return { message: "Demo bookings are not saved, so they cannot be looked up." };
  }

  try {
    const booking = await findBooking(result.data);

    // The same message covers a wrong reference and a wrong email, so neither can be guessed.
    return booking ? { result: booking } : { message: "We could not find a booking with those details." };
  } catch {
    return { message: "We could not search for your booking. Please try again." };
  }
};
