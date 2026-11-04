export const PLANNER_STORAGE_KEY = "hotel-jr-trip-plan";
export const MAX_TRIP_DAYS = 30;

export const tripStyles = [
  { value: "relaxed", label: "Relaxed", detail: "1 activity a day", perDay: 1 },
  { value: "balanced", label: "Balanced", detail: "2 activities a day", perDay: 2 },
  { value: "packed", label: "Packed", detail: "3 activities a day", perDay: 3 },
] as const;
