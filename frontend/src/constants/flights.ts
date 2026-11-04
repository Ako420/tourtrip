export const cabinOptions = ["Economy", "Premium Economy", "Business", "First"] as const;

export const tripTypes = [
  { value: "round-trip", label: "Round-trip" },
  { value: "one-way", label: "One-way" },
] as const;

export const passengerLimits = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
};

export const defaultPassengers = { adults: 1, children: 0 };

export const FLIGHTS_PAGE_SIZE = 6;

export const flightSortOptions = [
  { value: "best", label: "Best" },
  { value: "cheapest", label: "Cheapest" },
  { value: "fastest", label: "Fastest" },
  { value: "earliest", label: "Earliest" },
] as const;

export const stopFilters = [
  { value: 0, label: "Nonstop" },
  { value: 1, label: "1 stop" },
  { value: 2, label: "2+ stops" },
];

export const departureWindows = [
  { id: "morning", label: "Morning", detail: "6:00 - 11:59", start: 6, end: 12 },
  { id: "afternoon", label: "Afternoon", detail: "12:00 - 17:59", start: 12, end: 18 },
  { id: "evening", label: "Evening", detail: "18:00 - 23:59", start: 18, end: 24 },
  { id: "night", label: "Night", detail: "0:00 - 5:59", start: 0, end: 6 },
];
