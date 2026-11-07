import { CURRENCY } from "../mappers/flight.mapper.js";
import { addDays, formatDuration } from "../utils/dates.js";
import { getPageInfo } from "../utils/pagination.js";
import { buildOffers, getRouteSchedules } from "./flightOffer.service.js";

const PAGE_SIZE = 6;

const CALENDAR_DAYS = [-3, -2, -1, 0, 1, 2, 3];

const DEPARTURE_WINDOWS = {
  morning: { start: 6, end: 12 },
  afternoon: { start: 12, end: 18 },
  evening: { start: 18, end: 24 },
  night: { start: 0, end: 6 },
};

const getTravelMinutes = ({ outbound, inbound }) => outbound.durationMinutes + (inbound?.durationMinutes ?? 0);

const getBestScore = (offer) => offer.totalPrice + getTravelMinutes(offer) * 0.5;

const SORTERS = {
  best: (a, b) => getBestScore(a) - getBestScore(b),
  cheapest: (a, b) => a.totalPrice - b.totalPrice,
  fastest: (a, b) => getTravelMinutes(a) - getTravelMinutes(b),
  earliest: (a, b) => a.outbound.departMinutes - b.outbound.departMinutes,
};

const matchesDeparture = (offer, departure) => {
  const hour = offer.outbound.departMinutes / 60;

  return departure.some((id) => hour >= DEPARTURE_WINDOWS[id].start && hour < DEPARTURE_WINDOWS[id].end);
};

const matchesFilters = (offer, { stops, airlines, departure, maxPrice, refundable, checkedBag }) => {
  return (
    (stops.length === 0 || stops.includes(Math.min(offer.outbound.stops, 2))) &&
    (airlines.length === 0 || airlines.includes(offer.airline)) &&
    (departure.length === 0 || matchesDeparture(offer, departure)) &&
    offer.totalPrice <= (maxPrice ?? Infinity) &&
    (!refundable || offer.refundable) &&
    (!checkedBag || offer.checkedBag)
  );
};

const getPriceRange = (offers) => {
  const prices = offers.map(({ totalPrice }) => totalPrice);

  return { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 };
};

const getLowestByAirline = (offers) => {
  const lowest = new Map();

  for (const { airline, totalPrice } of offers) {
    lowest.set(airline, Math.min(lowest.get(airline) ?? Infinity, totalPrice));
  }

  return [...lowest].map(([name, lowestPrice]) => ({ name, lowestPrice }));
};

// The cheapest flight's real price each day, so the calendar never shows a fare that can't be booked.
const getFareCalendar = async (schedules, query) => {
  const days = await Promise.all(
    CALENDAR_DAYS.map(async (offset) => {
      const date = addDays(query.departDate, offset);
      const offers = await buildOffers(schedules, { ...query, departDate: date });

      return { date, lowestPrice: Math.min(...offers.map(({ pricePerAdult }) => pricePerAdult)) };
    }),
  );

  return days.filter(({ lowestPrice }) => Number.isFinite(lowestPrice));
};

// Prices stay numbers, because the frontend's Price component converts them. It reads this even when it's empty.
const getSortSummary = (offers) => {
  if (offers.length === 0) {
    return {};
  }

  const [best] = offers.toSorted(SORTERS.best);
  const [cheapest] = offers.toSorted(SORTERS.cheapest);
  const [fastest] = offers.toSorted(SORTERS.fastest);

  return {
    best: best.totalPrice,
    cheapest: cheapest.totalPrice,
    fastest: formatDuration(fastest.outbound.durationMinutes),
  };
};

export const searchFlights = async (query) => {
  const { sort, page: requestedPage } = query;
  const schedules = await getRouteSchedules(query);
  const offers = await buildOffers(schedules, query);
  const matches = offers.filter((offer) => matchesFilters(offer, query)).toSorted(SORTERS[sort]);
  const { page, pageCount, skip, take } = getPageInfo(matches.length, requestedPage, PAGE_SIZE);

  return {
    items: matches.slice(skip, skip + take),
    total: matches.length,
    page,
    pageCount,
    currency: CURRENCY,
    priceRange: getPriceRange(offers),
    airlines: getLowestByAirline(offers),
    fareCalendar: await getFareCalendar(schedules, query),
    sortSummary: getSortSummary(matches),
  };
};
