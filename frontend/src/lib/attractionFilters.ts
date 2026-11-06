import { ATTRACTION_QUERY_LENGTH, attractionCategories, attractionSortOptions } from "@/constants";
import type { AttractionCategory, AttractionFilters, AttractionSort, RouteParams } from "@/types";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

export const parseAttractionFilters = (params: RouteParams): AttractionFilters => {
  const category = getParam(params, "category") as AttractionCategory;
  const sort = getParam(params, "sort") as AttractionSort;
  const page = Number.parseInt(getParam(params, "page") ?? "", 10);

  return {
    query: getParam(params, "q")?.trim().slice(0, ATTRACTION_QUERY_LENGTH) || undefined,
    category: attractionCategories.some((item) => item.id === category) ? category : "all",
    freeCancellation: getParam(params, "freeCancellation") === "true",
    sort: attractionSortOptions.some((option) => option.value === sort) ? sort : "recommended",
    page: page > 0 ? Math.min(page, Number.MAX_SAFE_INTEGER) : 1,
  };
};

export const toAttractionQuery = (filters: AttractionFilters) => {
  const values = {
    q: filters.query,
    category: filters.category === "all" ? undefined : filters.category,
    freeCancellation: filters.freeCancellation ? "true" : undefined,
    sort: filters.sort === "recommended" ? undefined : filters.sort,
    page: filters.page > 1 ? filters.page : undefined,
  };
  const query = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });

  return query.toString();
};
