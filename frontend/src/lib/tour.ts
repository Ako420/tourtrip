import { enquiryLimits } from "@/constants";
import type { EnquiryDefaults, RouteParams } from "@/types";
import { isIsoDate } from "./dates";
import { formatCount } from "./format";

export const parseTourQuery = (params: RouteParams) => {
  const value = params.q;

  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
};

export const formatTourLength = (days: number) => {
  return `${formatCount(days, "day")}, ${formatCount(days - 1, "night")}`;
};

export const parseEnquiryDefaults = (params: RouteParams): EnquiryDefaults => {
  const date = Array.isArray(params.date) ? params.date[0] : params.date;
  const travelers = Number(Array.isArray(params.travelers) ? params.travelers[0] : params.travelers);

  return {
    date: date && isIsoDate(date) ? date : undefined,
    travelers:
      travelers >= enquiryLimits.minTravelers && travelers <= enquiryLimits.maxTravelers ? travelers : undefined,
  };
};
