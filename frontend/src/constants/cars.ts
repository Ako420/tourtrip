export const CARS_PAGE_SIZE = 6;
export const MAX_RENTAL_DAYS = 30;
export const DEFAULT_RENTAL_TIME = "10:00";

export const carCategories = [
  { id: "economy", label: "Economy" },
  { id: "compact", label: "Compact" },
  { id: "sedan", label: "Sedan" },
  { id: "suv", label: "SUV" },
  { id: "van", label: "Van" },
  { id: "luxury", label: "Luxury" },
] as const;

export const carSortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "cheapest", label: "Price: low to high" },
  { value: "rating", label: "Supplier rating" },
] as const;

export const carTransmissions = ["Automatic", "Manual"] as const;

export const rentalTimes = Array.from({ length: 33 }, (_, index) => {
  const minutes = 6 * 60 + index * 30;
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");

  return `${hours}:${minutes % 60 === 0 ? "00" : "30"}`;
});

export const MIN_DRIVER_AGE = 21;
export const STANDARD_DRIVER_AGE = { min: 25, max: 69 };
