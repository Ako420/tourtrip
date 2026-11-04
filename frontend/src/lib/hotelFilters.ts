import type { HotelFilters, HotelSearch, HotelSort, RouteParams } from "@/types";
import { hotelSortOptions } from "@/constants";
import { toSearchQuery } from "./search";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getNumber = (value: string | undefined) => {
  const number = Number(value);

  return value && Number.isFinite(number) && number >= 0 ? number : undefined;
};

const getList = (value: string | undefined) => value?.split(",").filter(Boolean) ?? [];

export const defaultHotelFilters: HotelFilters = {
  stars: [],
  amenities: [],
  freeCancellation: false,
  breakfast: false,
  sort: "recommended",
  page: 1,
};

export const parseHotelFilters = (params: RouteParams): HotelFilters => {
  const sort = getParam(params, "sort") as HotelSort;

  return {
    minPrice: getNumber(getParam(params, "minPrice")),
    maxPrice: getNumber(getParam(params, "maxPrice")),
    stars: getList(getParam(params, "stars")).map(Number).filter(Number.isInteger),
    minRating: getNumber(getParam(params, "minRating")),
    amenities: getList(getParam(params, "amenities")),
    freeCancellation: getParam(params, "freeCancellation") === "true",
    breakfast: getParam(params, "breakfast") === "true",
    sort: hotelSortOptions.some((option) => option.value === sort) ? sort : "recommended",
    page: Math.max(Math.floor(getNumber(getParam(params, "page")) ?? 1), 1),
  };
};

export const toHotelQuery = (search: HotelSearch, filters: HotelFilters) => {
  const query = new URLSearchParams(toSearchQuery(search));
  const values = {
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    stars: filters.stars.join(","),
    minRating: filters.minRating,
    amenities: filters.amenities.join(","),
    freeCancellation: filters.freeCancellation ? "true" : undefined,
    breakfast: filters.breakfast ? "true" : undefined,
    sort: filters.sort === "recommended" ? undefined : filters.sort,
    page: filters.page > 1 ? filters.page : undefined,
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};

export const countActiveFilters = (filters: HotelFilters) => {
  return (
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    filters.stars.length +
    (filters.minRating !== undefined ? 1 : 0) +
    filters.amenities.length +
    (filters.freeCancellation ? 1 : 0) +
    (filters.breakfast ? 1 : 0)
  );
};
