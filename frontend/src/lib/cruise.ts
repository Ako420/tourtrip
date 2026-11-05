import { cruisesPath } from "@/constants";
import type { CruiseFilters, RouteParams } from "@/types";
import { isIsoDate } from "./dates";

const getParam = (params: RouteParams, key: string) => {
  const value = params[key];

  return Array.isArray(value) ? value[0] : value;
};

export const parseCruiseFilters = (params: RouteParams): CruiseFilters => {
  const date = getParam(params, "date");

  return {
    query: getParam(params, "q")?.trim() || undefined,
    date: date && isIsoDate(date) ? date : undefined,
    line: getParam(params, "line")?.trim() || undefined,
  };
};

export const toCruiseHref = ({ query, date, line }: CruiseFilters) => {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (date) params.set("date", date);
  if (line) params.set("line", line);

  const text = params.toString();

  return text ? `${cruisesPath}?${text}` : cruisesPath;
};
