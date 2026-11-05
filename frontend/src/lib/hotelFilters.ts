import type { HotelFilters, HotelSearch, HotelSort, RouteParams } from "@/types";
import { hotelFilterLimits, hotelSortOptions } from "@/constants";
import { toSearchQuery } from "./search";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

const getNumber = (value: string | undefined, max = Number.MAX_SAFE_INTEGER) => {
  const number = Number(value);

  return value && Number.isFinite(number) && number >= 0 ? Math.min(number, max) : undefined;
};

const getList = (value: string | undefined) => value?.split(",").filter(Boolean) ?? [];

const isStarRating = (stars: number) => {
  const { min, max } = hotelFilterLimits.stars;

  return Number.isInteger(stars) && stars >= min && stars <= max;
};

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
    minPrice: getNumber(getParam(params, "minPrice"), hotelFilterLimits.price),
    maxPrice: getNumber(getParam(params, "maxPrice"), hotelFilterLimits.price),
    stars: getList(getParam(params, "stars")).map(Number).filter(isStarRating),
    minRating: getNumber(getParam(params, "minRating"), hotelFilterLimits.rating),
    amenities: getList(getParam(params, "amenities")).slice(0, hotelFilterLimits.amenities),
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
