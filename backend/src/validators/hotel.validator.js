import { z } from "zod";
import { commaList, dropEmpty, isoDate, MAX_PRICE, number, page, queryBoolean, wholeNumber } from "../utils/validators.js";

// Each amenity adds a join to the search, and the time grows quickly: 20 takes about 30ms, 160 takes about 4s.
const MAX_AMENITIES = 20;

const SORTS = ["recommended", "price-asc", "price-desc", "rating"];

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
