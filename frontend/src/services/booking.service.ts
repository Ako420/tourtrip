import { randomUUID } from "node:crypto";
import { SAMPLE_BOOKING_EMAIL, sampleBookings } from "@/data";
import type { BookingLookup, BookingRecord, BookingRequest, BookingResponse } from "@/types";
import { ApiError, apiPost, isApiEnabled } from "./http";

export const createBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
  if (isApiEnabled) {
    return apiPost<BookingResponse>("/bookings", booking);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};

export const findBooking = async ({ reference, email }: BookingLookup): Promise<BookingRecord | null> => {
  if (!isApiEnabled) {
    const isSampleEmail = email.toLowerCase() === SAMPLE_BOOKING_EMAIL;

    return (isSampleEmail && sampleBookings.find((booking) => booking.reference === reference)) || null;
  }

  try {
    return await apiPost<BookingRecord>("/bookings/lookup", { reference, email });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getSampleBookingHint = () => {
  if (isApiEnabled) {
    return null;
  }

  return { email: SAMPLE_BOOKING_EMAIL, references: sampleBookings.map((booking) => booking.reference) };
};
