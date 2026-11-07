import { randomUUID } from "node:crypto";
import type { AttractionBookingRequest, BookingResponse } from "@/types";
import { apiPost, isApiLive } from "./http";

export const createAttractionBooking = async (booking: AttractionBookingRequest): Promise<BookingResponse> => {
  if (isApiLive("bookings")) {
    return apiPost<BookingResponse>("/attractions/bookings", booking, { auth: true });
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
