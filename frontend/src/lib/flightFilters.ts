import { departureWindows, flightFilterLimits, flightSortOptions } from "@/constants";
import type { FlightFilters, FlightSearch, FlightSort, RouteParams } from "@/types";
import { toFlightQuery } from "./flightSearch";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getList = (value: string | undefined) => value?.split("|").filter(Boolean) ?? [];

const getNumber = (value: string | undefined, max = Number.MAX_SAFE_INTEGER) => {
  const number = Number(value);

  return value && Number.isFinite(number) && number >= 0 ? Math.min(number, max) : undefined;
};

export const defaultFlightFilters: FlightFilters = {
  stops: [],
  airlines: [],
  departureWindows: [],
  refundable: false,
  checkedBag: false,
  sort: "best",
  page: 1,
};

const isStopCount = (stops: number) => {
  const { min, max } = flightFilterLimits.stops;

  return Number.isInteger(stops) && stops >= min && stops <= max;
};

const isDepartureWindow = (id: string) => departureWindows.some((window) => window.id === id);

export const parseFlightFilters = (params: RouteParams): FlightFilters => {
  const sort = getParam(params, "sort") as FlightSort;

  return {
    stops: getList(getParam(params, "stops")).map(Number).filter(isStopCount),
    airlines: getList(getParam(params, "airlines")),
    departureWindows: getList(getParam(params, "departure")).filter(isDepartureWindow),
    maxPrice: getNumber(getParam(params, "maxPrice"), flightFilterLimits.price),
    refundable: getParam(params, "refundable") === "true",
    checkedBag: getParam(params, "checkedBag") === "true",
    sort: flightSortOptions.some((option) => option.value === sort) ? sort : "best",
    page: Math.max(Math.floor(getNumber(getParam(params, "page")) ?? 1), 1),
  };
};

export const toFlightResultsQuery = (search: FlightSearch, filters: FlightFilters) => {
  const query = new URLSearchParams(toFlightQuery(search));
  const values = {
    stops: filters.stops.join("|"),
    airlines: filters.airlines.join("|"),
    departure: filters.departureWindows.join("|"),
    maxPrice: filters.maxPrice,
    refundable: filters.refundable ? "true" : undefined,
    checkedBag: filters.checkedBag ? "true" : undefined,
    sort: filters.sort === "best" ? undefined : filters.sort,
    page: filters.page > 1 ? filters.page : undefined,
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const countFlightFilters = (filters: FlightFilters) => {
  return (
    filters.stops.length +
    filters.airlines.length +
    filters.departureWindows.length +
    (filters.maxPrice !== undefined ? 1 : 0) +
    (filters.refundable ? 1 : 0) +
    (filters.checkedBag ? 1 : 0)
  );
};
