import { z } from "zod";
import { dropEmpty, page, queryBoolean } from "../utils/validators.js";

const CATEGORIES = ["landmarks", "nature", "adventure", "city"];

const SORTS = ["recommended", "rating", "price-asc"];

// Only a string check, because the frontend shows its not-found page for a 404 and an error page for a 400.
export const attractionParamsSchema = z.object({ slug: z.string() });

export const attractionSearchSchema = z.preprocess(
  dropEmpty,
  z.object({
    q: z.string("Enter a place or attraction").trim().max(100, "Search must be 100 characters or fewer").optional(),
    category: z.enum(CATEGORIES, "Choose a valid category").optional(),
    freeCancellation: queryBoolean,
    sort: z.enum(SORTS, "Choose a valid sort order").default("recommended"),
    page,
  }),
);
