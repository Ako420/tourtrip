import { randomUUID } from "node:crypto";
import { buildCarOffers } from "@/data";
import { getRentalDays, toCarQuery } from "@/lib";
import type { BookingResponse, CarBookingRequest, CarOffer, CarSearch } from "@/types";
import { ApiError, apiGet, apiPost, isApiEnabled } from "./http";

export const getCarOffer = async (search: CarSearch, offerId: string): Promise<CarOffer | null> => {
  if (!isApiEnabled) {
    return buildCarOffers(search, getRentalDays(search)).find((offer) => offer.id === offerId) ?? null;
  }

  const params = Object.fromEntries(new URLSearchParams(toCarQuery(search)));

  try {
    return await apiGet<CarOffer>(`/cars/offers/${encodeURIComponent(offerId)}`, params);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createCarBooking = async (booking: CarBookingRequest): Promise<BookingResponse> => {
  if (isApiEnabled) {
    return apiPost<BookingResponse>("/cars/bookings", booking);
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
