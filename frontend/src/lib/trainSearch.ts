import { defaultPassengers, flightSortOptions, passengerLimits, seatClasses } from "@/constants";
import type { FlightSort, RouteParams, SeatClass, TrainFilters, TrainSearch } from "@/types";
import { isIsoDate } from "./dates";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getList = (value: string | undefined) => value?.split("|").filter(Boolean) ?? [];

const getCount = (value: string | undefined, fallback: number, { min, max }: { min: number; max: number }) => {
  const count = Number.parseInt(value ?? "", 10);

  return Number.isNaN(count) ? fallback : Math.min(Math.max(count, min), max);
};

const getDate = (value: string | undefined) => (value && isIsoDate(value) ? value : undefined);

export const defaultTrainFilters: TrainFilters = {
  changes: [],
  operators: [],
  departureWindows: [],
  refundable: false,
  sort: "best",
  page: 1,
};

export const parseTrainSearch = (params: RouteParams): TrainSearch => {
  const seatClass = getParam(params, "seatClass") as SeatClass;

  return {
    from: getParam(params, "from")?.trim() || undefined,
    to: getParam(params, "to")?.trim() || undefined,
    tripType: getParam(params, "tripType") === "one-way" ? "one-way" : "round-trip",
    departDate: getDate(getParam(params, "departDate")),
    returnDate: getDate(getParam(params, "returnDate")),
    adults: getCount(getParam(params, "adults"), defaultPassengers.adults, passengerLimits.adults),
    children: getCount(getParam(params, "children"), defaultPassengers.children, passengerLimits.children),
    seatClass: seatClasses.includes(seatClass) ? seatClass : "Standard",
  };
};

export const parseTrainFilters = (params: RouteParams): TrainFilters => {
  const sort = getParam(params, "sort") as FlightSort;
  const page = Number.parseInt(getParam(params, "page") ?? "", 10);

  return {
    changes: getList(getParam(params, "changes")).map(Number).filter(Number.isInteger),
    operators: getList(getParam(params, "operators")),
    departureWindows: getList(getParam(params, "departure")),
    refundable: getParam(params, "refundable") === "true",
    sort: flightSortOptions.some((option) => option.value === sort) ? sort : "best",
    page: page > 0 ? page : 1,
  };
};

export const parseTrainBookingParams = (params: RouteParams) => {
  return { offerId: getParam(params, "offer") ?? "", reference: getParam(params, "reference") ?? "" };
};

export const toTrainQuery = (search: TrainSearch, filters?: TrainFilters) => {
  const values = {
    ...search,
    changes: filters?.changes.join("|"),
    operators: filters?.operators.join("|"),
    departure: filters?.departureWindows.join("|"),
    refundable: filters?.refundable ? "true" : undefined,
    sort: !filters || filters.sort === "best" ? undefined : filters.sort,
    page: filters && filters.page > 1 ? filters.page : undefined,
  };
  const query = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const countTrainFilters = (filters: TrainFilters) => {
  return (
    filters.changes.length +
    filters.operators.length +
    filters.departureWindows.length +
    (filters.refundable ? 1 : 0)
  );
};
