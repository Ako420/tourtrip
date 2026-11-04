import { defaultGuests, guestLimits } from "@/constants";
import type { HotelSearch, RouteParams } from "@/types";
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

export const parseHotelSearch = (params: RouteParams): HotelSearch => {
  const checkIn = getDate(getParam(params, "checkIn"));
  const checkOut = getDate(getParam(params, "checkOut"));
  const hasValidStay = Boolean(checkIn && checkOut && checkOut > checkIn);

  return {
    destination: getParam(params, "destination")?.trim() || undefined,
    checkIn: hasValidStay ? checkIn : undefined,
    checkOut: hasValidStay ? checkOut : undefined,
    rooms: getCount(getParam(params, "rooms"), defaultGuests.rooms, guestLimits.rooms),
    adults: getCount(getParam(params, "adults"), defaultGuests.adults, guestLimits.adults),
    children: getCount(getParam(params, "children"), defaultGuests.children, guestLimits.children),
  };
};

export const toSearchQuery = (search: HotelSearch) => {
  const query = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
};
