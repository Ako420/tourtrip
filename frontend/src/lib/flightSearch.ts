import { cabinOptions, defaultPassengers, passengerLimits } from "@/constants";
import type { CabinClass, FlightDeal, FlightSearch, RouteParams } from "@/types";
import { isIsoDate } from "./dates";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getCount = (value: string | undefined, fallback: number, { min, max }: { min: number; max: number }) => {
  const count = Number.parseInt(value ?? "", 10);

  return Number.isNaN(count) ? fallback : Math.min(Math.max(count, min), max);
};

const getDate = (value: string | undefined) => {
  return value && isIsoDate(value) ? value : undefined;
};

export const parseFlightSearch = (params: RouteParams): FlightSearch => {
  const cabin = getParam(params, "cabin") as CabinClass;

  return {
    from: getParam(params, "from")?.trim() || undefined,
    to: getParam(params, "to")?.trim() || undefined,
    tripType: getParam(params, "tripType") === "one-way" ? "one-way" : "round-trip",
    isNonstop: getParam(params, "nonstop") === "true",
    departDate: getDate(getParam(params, "departDate")),
    returnDate: getDate(getParam(params, "returnDate")),
    adults: getCount(getParam(params, "adults"), defaultPassengers.adults, passengerLimits.adults),
    children: getCount(getParam(params, "children"), defaultPassengers.children, passengerLimits.children),
    cabin: cabinOptions.includes(cabin) ? cabin : "Economy",
  };
};

export const toFlightQuery = ({ isNonstop, ...search }: FlightSearch) => {
  const query = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  if (isNonstop) {
    query.set("nonstop", "true");
  }

  return query.toString();
};

export const toFlightDealHref = ({ from, to, departDate, returnDate, cabin }: FlightDeal) => {
  const query = new URLSearchParams({ from, to, departDate, returnDate, cabin });

  return `/flights/results?${query}`;
};
