import { departureWindows, FLIGHTS_PAGE_SIZE } from "@/constants";
import { airports, buildFlightOffers, flightDeals, flightsContent, getFareForDate } from "@/data";
import { addDays, formatDuration, toFlightResultsQuery } from "@/lib";
import type {
  FlightDeal,
  FlightFilters,
  FlightOffer,
  FlightSearch,
  FlightSearchResult,
  FlightSort,
  FlightsContent,
} from "@/types";
import { apiGet, isApiLive } from "./http";

const getTravelMinutes = (offer: FlightOffer) => {
  return offer.outbound.durationMinutes + (offer.inbound?.durationMinutes ?? 0);
};

const getBestScore = (offer: FlightOffer) => Number(offer.totalPrice) + getTravelMinutes(offer) * 0.5;

const flightSorters: Record<FlightSort, (a: FlightOffer, b: FlightOffer) => number> = {
  best: (a, b) => getBestScore(a) - getBestScore(b),
  cheapest: (a, b) => Number(a.totalPrice) - Number(b.totalPrice),
  fastest: (a, b) => getTravelMinutes(a) - getTravelMinutes(b),
  earliest: (a, b) => a.outbound.departMinutes - b.outbound.departMinutes,
};

const matchesWindow = (offer: FlightOffer, windowIds: string[]) => {
  const hour = offer.outbound.departMinutes / 60;

  return (
    windowIds.length === 0 ||
    departureWindows.some(({ id, start, end }) => windowIds.includes(id) && hour >= start && hour < end)
  );
};

const matchesFlightFilters = (offer: FlightOffer, filters: FlightFilters) => {
  const stops = Math.min(offer.outbound.stops, 2);

  return (
    (filters.stops.length === 0 || filters.stops.includes(stops)) &&
    (filters.airlines.length === 0 || filters.airlines.includes(offer.airline)) &&
    matchesWindow(offer, filters.departureWindows) &&
    Number(offer.totalPrice) <= (filters.maxPrice ?? Infinity) &&
    (!filters.refundable || offer.refundable) &&
    (!filters.checkedBag || offer.checkedBag)
  );
};

export const searchFlights = async (search: FlightSearch, filters: FlightFilters): Promise<FlightSearchResult> => {
  if (isApiLive("flights")) {
    return apiGet<FlightSearchResult>("/flights/search", Object.fromEntries(new URLSearchParams(toFlightResultsQuery(search, filters))));
  }

  const offers = buildFlightOffers(search).filter((offer) => !search.isNonstop || offer.outbound.stops === 0);
  const matches = offers.filter((offer) => matchesFlightFilters(offer, filters));
  const sorted = matches.toSorted(flightSorters[filters.sort]);
  const pageCount = Math.max(Math.ceil(sorted.length / FLIGHTS_PAGE_SIZE), 1);
  const page = Math.min(filters.page, pageCount);
  const prices = offers.map((offer) => Number(offer.totalPrice));
  const lowestByAirline = new Map<string, number>();

  offers.forEach((offer) => {
    const lowest = lowestByAirline.get(offer.airline) ?? Infinity;

    lowestByAirline.set(offer.airline, Math.min(lowest, Number(offer.totalPrice)));
  });

  const cheapest = matches.toSorted(flightSorters.cheapest)[0];
  const fastest = matches.toSorted(flightSorters.fastest)[0];
  const best = matches.toSorted(flightSorters.best)[0];

  return {
    items: sorted.slice((page - 1) * FLIGHTS_PAGE_SIZE, page * FLIGHTS_PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
    currency: "USD",
    priceRange: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 },
    airlines: [...lowestByAirline].map(([name, lowestPrice]) => ({ name, lowestPrice })),
    fareCalendar: [-3, -2, -1, 0, 1, 2, 3].map((offset) => {
      const date = addDays(search.departDate ?? "", offset);

      return { date, lowestPrice: getFareForDate(search, date) };
    }),
    sortSummary: {
      best: best?.totalPrice,
      cheapest: cheapest?.totalPrice,
      fastest: fastest && formatDuration(fastest.outbound.durationMinutes),
    },
  };
};

const matches = (value: string, query?: string) => {
  return !query || value.toLowerCase().includes(query.trim().toLowerCase());
};

export const getFlightsContent = async (): Promise<FlightsContent> => {
  return isApiLive("content") ? apiGet<FlightsContent>("/flights/content") : flightsContent;
};

export const getFlightDeals = async ({ from, to, isNonstop }: Partial<FlightSearch> = {}): Promise<FlightDeal[]> => {
  if (isApiLive("flights")) {
    return apiGet<FlightDeal[]>("/flights/deals", { from, to, nonstop: isNonstop ? "true" : undefined });
  }

  return flightDeals.filter((deal) => {
    return matches(deal.from, from) && matches(deal.to, to) && (!isNonstop || deal.isNonstop);
  });
};

export const getAirports = async (): Promise<string[]> => {
  return isApiLive("flights") ? apiGet<string[]>("/airports") : airports;
};
