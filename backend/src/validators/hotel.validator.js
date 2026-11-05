import { z } from "zod";
import { commaList, isoDate, page, queryBoolean } from "../utils/validators.js";

// The most a Decimal(10, 2) column can hold.
const MAX_PRICE = 99999999.99;

// Each amenity adds a join to the search, and the time grows quickly: 20 takes about 30ms, 160 takes about 4s.
const MAX_AMENITIES = 20;

const SORTS = ["recommended", "price-asc", "price-desc", "rating"];

const number = (label, { min, max }) => {
  return z.coerce
    .number(`${label} must be a number`)
    .min(min, `${label} must be ${min} or higher`)
    .max(max, `${label} must be ${max} or lower`);
};

const wholeNumber = (label, limits) => number(label, limits).int(`${label} must be a whole number`);

// An empty value means the filter isn't set, but coercing it would give 0.
const dropEmpty = (query) => Object.fromEntries(Object.entries(query).filter(([, value]) => value !== ""));

export const hotelListSchema = z.object({
  destination: z.string("Enter a destination").trim().max(100, "Destination must be 100 characters or fewer").optional(),
});

// Only a string check, because the frontend shows its not-found page for a 404 and an error page for a 400.
export const hotelParamsSchema = z.object({ slug: z.string() });

export const hotelSearchSchema = z.preprocess(
  dropEmpty,
  hotelListSchema.extend({
    checkIn: isoDate.optional(),
    checkOut: isoDate.optional(),
    rooms: wholeNumber("Rooms", { min: 1, max: 8 }).optional(),
    adults: wholeNumber("Adults", { min: 1, max: 16 }).optional(),
    children: wholeNumber("Children", { min: 0, max: 10 }).optional(),
    minPrice: number("Minimum price", { min: 0, max: MAX_PRICE }).optional(),
    maxPrice: number("Maximum price", { min: 0, max: MAX_PRICE }).optional(),
    stars: commaList(wholeNumber("Stars", { min: 1, max: 5 })),
    minRating: number("Minimum rating", { min: 0, max: 10 }).optional(),
    amenities: commaList().refine((ids) => ids.length <= MAX_AMENITIES, `Choose ${MAX_AMENITIES} amenities or fewer`),
    freeCancellation: queryBoolean,
    breakfast: queryBoolean,
    sort: z.enum(SORTS, "Choose a valid sort order").default("recommended"),
    page,
  }),
);
