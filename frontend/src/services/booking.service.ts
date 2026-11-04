import { randomUUID } from "node:crypto";
import type { BookingRequest, BookingResponse } from "@/types";
import { apiPost, isApiEnabled } from "./http";

export const createBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
  if (isApiEnabled) {
    return apiPost<BookingResponse>("/bookings", booking);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
