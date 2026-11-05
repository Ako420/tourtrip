import type { RouteParams } from "@/types";
import { formatCount } from "./format";

export const parseTourQuery = (params: RouteParams) => {
  const value = params.q;

  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
};

export const formatTourLength = (days: number) => {
  return `${formatCount(days, "day")}, ${formatCount(days - 1, "night")}`;
};
