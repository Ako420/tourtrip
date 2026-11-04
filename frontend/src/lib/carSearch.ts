import { carSortOptions, DEFAULT_RENTAL_TIME, rentalTimes } from "@/constants";
import type { CarFilters, CarSearch, CarSort, RouteParams } from "@/types";
import { isIsoDate } from "./dates";

type RentalPeriod = {
  pickupDate?: string;
  pickupTime: string;
  dropoffDate?: string;
  dropoffTime: string;
};

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getList = (value: string | undefined) => value?.split("|").filter(Boolean) ?? [];

const getDate = (value: string | undefined) => (value && isIsoDate(value) ? value : undefined);

const getTime = (value: string | undefined) => {
  return value && rentalTimes.includes(value) ? value : DEFAULT_RENTAL_TIME;
};

export const getRentalHours = ({ pickupDate, pickupTime, dropoffDate, dropoffTime }: RentalPeriod) => {
  const pickup = Date.parse(`${pickupDate}T${pickupTime}:00Z`);
  const dropoff = Date.parse(`${dropoffDate}T${dropoffTime}:00Z`);

  return (dropoff - pickup) / 3_600_000;
};

// Rentals are charged per started 24 hours, which is how most suppliers count days.
export const getRentalDays = (period: RentalPeriod) => {
  return Math.max(Math.ceil(getRentalHours(period) / 24), 1);
};

export const getAgeOnDate = (birthDate: string, date: string) => {
  const years = Number(date.slice(0, 4)) - Number(birthDate.slice(0, 4));

  return date.slice(5) < birthDate.slice(5) ? years - 1 : years;
};

export const parseCarBookingParams = (params: RouteParams) => {
  return { offerId: getParam(params, "offer") ?? "", reference: getParam(params, "reference") ?? "" };
};

export const parseCarSearch = (params: RouteParams): CarSearch => {
  return {
    location: getParam(params, "location")?.trim() || undefined,
    dropoffLocation: getParam(params, "dropoffLocation")?.trim() || undefined,
    pickupDate: getDate(getParam(params, "pickupDate")),
    pickupTime: getTime(getParam(params, "pickupTime")),
    dropoffDate: getDate(getParam(params, "dropoffDate")),
    dropoffTime: getTime(getParam(params, "dropoffTime")),
    isStandardAge: getParam(params, "standardAge") !== "false",
  };
};

export const parseCarFilters = (params: RouteParams): CarFilters => {
  const sort = getParam(params, "sort") as CarSort;
  const page = Number.parseInt(getParam(params, "page") ?? "", 10);

  return {
    categories: getList(getParam(params, "type")),
    transmissions: getList(getParam(params, "transmission")),
    suppliers: getList(getParam(params, "supplier")),
    freeCancellation: getParam(params, "freeCancellation") === "true",
    sort: carSortOptions.some((option) => option.value === sort) ? sort : "recommended",
    page: page > 0 ? page : 1,
  };
};

export const toCarQuery = (search: CarSearch, filters?: Partial<CarFilters>) => {
  const values = {
    location: search.location,
    dropoffLocation: search.dropoffLocation,
    pickupDate: search.pickupDate,
    pickupTime: search.pickupTime,
    dropoffDate: search.dropoffDate,
    dropoffTime: search.dropoffTime,
    standardAge: search.isStandardAge ? undefined : "false",
    type: filters?.categories?.join("|"),
    transmission: filters?.transmissions?.join("|"),
    supplier: filters?.suppliers?.join("|"),
    freeCancellation: filters?.freeCancellation ? "true" : undefined,
    sort: filters?.sort === "recommended" ? undefined : filters?.sort,
    page: filters?.page && filters.page > 1 ? filters.page : undefined,
  };
  const query = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const countCarFilters = (filters: CarFilters) => {
  return (
    filters.categories.length +
    filters.transmissions.length +
    filters.suppliers.length +
    (filters.freeCancellation ? 1 : 0)
  );
};
