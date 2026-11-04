import { randomUUID } from "node:crypto";
import { buildFlightOffers } from "@/data";
import { toFlightQuery } from "@/lib";
import type { BookingResponse, FlightBookingRequest, FlightOffer, FlightSearch } from "@/types";
import { ApiError, apiGet, apiPost, isApiEnabled } from "./http";

export const getFlightOffer = async (search: FlightSearch, offerId: string): Promise<FlightOffer | null> => {
  if (!isApiEnabled) {
    return buildFlightOffers(search).find((offer) => offer.id === offerId) ?? null;
  }

  const params = Object.fromEntries(new URLSearchParams(toFlightQuery(search)));

  try {
    return await apiGet<FlightOffer>(`/flights/offers/${encodeURIComponent(offerId)}`, params);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createFlightBooking = async (booking: FlightBookingRequest): Promise<BookingResponse> => {
  if (isApiEnabled) {
    return apiPost<BookingResponse>("/flights/bookings", booking);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
