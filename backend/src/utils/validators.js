import { z } from "zod";

const listOf = (separator) => {
  return (item = z.string().min(1)) => {
    return z
      .string()
      .default("")
      .transform((value) => value.split(separator).filter(Boolean))
      .pipe(z.array(item));
  };
};

// The most a Decimal(10, 2) column can hold.
export const MAX_PRICE = 99999999.99;

// An empty value means the filter isn't set, but coercing it would give 0.
export const dropEmpty = (query) => Object.fromEntries(Object.entries(query).filter(([, value]) => value !== ""));

export const emailField = z
  .string("Enter your email address")
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

export const isoDate = z.iso.date("Enter a valid date");

// z.coerce.boolean() would turn the text "false" into true.
export const queryBoolean = z
  .enum(["true", "false"], "Must be true or false")
  .default("false")
  .transform((value) => value === "true");

export const number = (label, { min, max }) => {
  return z.coerce
    .number(`${label} must be a number`)
    .min(min, `${label} must be ${min} or higher`)
    .max(max, `${label} must be ${max} or lower`);
};

export const wholeNumber = (label, limits) => number(label, limits).int(`${label} must be a whole number`);

export const commaList = listOf(",");

export const pipeList = listOf("|");

export const page = z.coerce
  .number("Page must be a number")
  .int("Page must be a whole number")
  .min(1, "Page must be 1 or higher")
  .default(1);
