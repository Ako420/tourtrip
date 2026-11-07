import { randomUUID } from "node:crypto";
import { departureWindows, TRAINS_PAGE_SIZE } from "@/constants";
import { buildTrainOffers, getTrainFareForDate, trainsContent, trainStations } from "@/data";
import { addDays, formatDuration, toTrainQuery } from "@/lib";
import type {
  BookingResponse,
  FlightSort,
  TrainBookingRequest,
  TrainFilters,
  TrainOffer,
  TrainSearch,
  TrainSearchResult,
  TrainsContent,
} from "@/types";
import { ApiError, apiGet, apiPost, isApiLive } from "./http";

const getTravelMinutes = (offer: TrainOffer) => {
  return offer.outbound.durationMinutes + (offer.inbound?.durationMinutes ?? 0);
};

const getBestScore = (offer: TrainOffer) => Number(offer.totalPrice) + getTravelMinutes(offer) * 0.2;

const sorters: Record<FlightSort, (a: TrainOffer, b: TrainOffer) => number> = {
  best: (a, b) => getBestScore(a) - getBestScore(b),
  cheapest: (a, b) => Number(a.totalPrice) - Number(b.totalPrice),
  fastest: (a, b) => getTravelMinutes(a) - getTravelMinutes(b),
  earliest: (a, b) => a.outbound.departMinutes - b.outbound.departMinutes,
};

const matchesWindow = (offer: TrainOffer, windowIds: string[]) => {
  const hour = offer.outbound.departMinutes / 60;

  return (
    windowIds.length === 0 ||
    departureWindows.some(({ id, start, end }) => windowIds.includes(id) && hour >= start && hour < end)
  );
};

const matchesTrainFilters = (offer: TrainOffer, filters: TrainFilters) => {
  return (
    (filters.changes.length === 0 || filters.changes.includes(Math.min(offer.outbound.stops, 2))) &&
    (filters.operators.length === 0 || filters.operators.includes(offer.operator)) &&
    matchesWindow(offer, filters.departureWindows) &&
    (!filters.refundable || offer.refundable)
  );
};

export const getTrainsContent = async (): Promise<TrainsContent> => {
  return isApiLive("content") ? apiGet<TrainsContent>("/trains/content") : trainsContent;
};

export const getTrainStations = async (): Promise<string[]> => {
  return isApiLive("trains") ? apiGet<string[]>("/trains/stations") : trainStations;
};

export const searchTrains = async (search: TrainSearch, filters: TrainFilters): Promise<TrainSearchResult> => {
  if (isApiLive("trains")) {
    return apiGet<TrainSearchResult>(
      "/trains/search",
      Object.fromEntries(new URLSearchParams(toTrainQuery(search, filters))),
    );
  }

  const offers = buildTrainOffers(search);
  const matches = offers.filter((offer) => matchesTrainFilters(offer, filters));
  const sorted = matches.toSorted(sorters[filters.sort]);
  const pageCount = Math.max(Math.ceil(sorted.length / TRAINS_PAGE_SIZE), 1);
  const page = Math.min(filters.page, pageCount);
  const lowestByOperator = new Map<string, number>();

  offers.forEach((offer) => {
    const lowest = lowestByOperator.get(offer.operator) ?? Infinity;

    lowestByOperator.set(offer.operator, Math.min(lowest, Number(offer.totalPrice)));
  });

  const cheapest = matches.toSorted(sorters.cheapest)[0];
  const fastest = matches.toSorted(sorters.fastest)[0];
  const best = matches.toSorted(sorters.best)[0];

  return {
    items: sorted.slice((page - 1) * TRAINS_PAGE_SIZE, page * TRAINS_PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
    currency: "USD",
    operators: [...lowestByOperator].map(([name, lowestPrice]) => ({ name, lowestPrice })),
    fareCalendar: [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
      const date = addDays(search.departDate ?? "", offset);

      return { date, lowestPrice: getTrainFareForDate(search, date) };
    }),
    sortSummary: {
      best: best?.totalPrice,
      cheapest: cheapest?.totalPrice,
      fastest: fastest && formatDuration(fastest.outbound.durationMinutes),
    },
  };
};

export const getTrainOffer = async (search: TrainSearch, offerId: string): Promise<TrainOffer | null> => {
  if (!isApiLive("trains")) {
    return buildTrainOffers(search).find((offer) => offer.id === offerId) ?? null;
  }

  const params = Object.fromEntries(new URLSearchParams(toTrainQuery(search)));

  try {
    return await apiGet<TrainOffer>(`/trains/offers/${encodeURIComponent(offerId)}`, params);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const createTrainBooking = async (booking: TrainBookingRequest): Promise<BookingResponse> => {
  if (isApiLive("bookings")) {
    return apiPost<BookingResponse>("/trains/bookings", booking, { auth: true });
  }

  return { reference: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}` };
};
