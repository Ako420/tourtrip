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

export const commaList = listOf(",");

export const pipeList = listOf("|");

export const page = z.coerce
  .number("Page must be a number")
  .int("Page must be a whole number")
  .min(1, "Page must be 1 or higher")
  .default(1);
