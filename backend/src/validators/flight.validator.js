import { z } from "zod";
import { dropEmpty, isoDate, page, queryBoolean, wholeNumber } from "../utils/validators.js";

const TRIP_TYPES = ["round-trip", "one-way"];

const CABINS = ["Economy", "Premium Economy", "Business", "First"];

const city = (message) => z.string(message).trim().max(100, "City must be 100 characters or fewer");

export const flightDealsSchema = z.preprocess(
  dropEmpty,
  z.object({
    from: city("Enter a departure city").optional(),
    to: city("Enter a destination").optional(),
    nonstop: queryBoolean,
  }),
);

// The frontend's flightSearchSchema checks the same rules, so visitors see a message instead of a 400.
export const flightSearchSchema = z.preprocess(
  dropEmpty,
  z
    .object({
      from: city("Enter a departure city").min(1, "Enter a departure city"),
      to: city("Enter a destination").min(1, "Enter a destination"),
      tripType: z.enum(TRIP_TYPES, "Choose a trip type").default("round-trip"),
      departDate: isoDate,
      returnDate: isoDate.optional(),
      adults: wholeNumber("Adults", { min: 1, max: 9 }).default(1),
      children: wholeNumber("Children", { min: 0, max: 8 }).default(0),
      cabin: z.enum(CABINS, "Choose a cabin").default("Economy"),
      nonstop: queryBoolean,
      page,
    })
    .refine(({ from, to }) => from.toLowerCase() !== to.toLowerCase(), {
      error: "Destination must be different from departure",
      path: ["to"],
    })
    .refine(({ tripType, departDate, returnDate }) => tripType === "one-way" || returnDate > departDate, {
      error: "Return must be after departure",
      path: ["returnDate"],
    }),
);
