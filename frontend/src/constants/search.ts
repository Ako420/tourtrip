export const guestLimits = {
  rooms: { min: 1, max: 8 },
  adults: { min: 1, max: 16 },
  children: { min: 0, max: 10 },
};

export const defaultGuests = { rooms: 1, adults: 2, children: 0 };

export const HOTELS_PAGE_SIZE = 5;

export const hotelSortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
] as const;

export const ratingFilters = [
  { value: 9, label: "Excellent 9+" },
  { value: 8, label: "Very good 8+" },
  { value: 7, label: "Good 7+" },
];

export const starFilters = [5, 4, 3];

export const priceBrackets = [
  { label: "Under $150", maxPrice: 150 },
  { label: "$150 - $250", minPrice: 150, maxPrice: 250 },
  { label: "$250 and up", minPrice: 250 },
];

export const bookingOffers = [
  { id: "promo", label: "Up to $12 off", detail: "Welcome code", iconName: "ticket" },
  { id: "first", label: "Up to 20% off", detail: "First booking", iconName: "tag" },
] as const;
