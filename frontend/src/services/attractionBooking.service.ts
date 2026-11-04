import { randomUUID } from "node:crypto";
import type { AttractionBookingRequest, BookingResponse } from "@/types";
import { apiPost, isApiEnabled } from "./http";

export const createAttractionBooking = async (booking: AttractionBookingRequest): Promise<BookingResponse> => {
  if (isApiEnabled) {
    return apiPost<BookingResponse>("/attractions/bookings", booking);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
