import { z } from "zod";
import { emailField } from "./fields";

const bookingLookupSchema = z.object({
  reference: z
    .string()
    .trim()
    .min(1, "Enter your booking reference")
    .toUpperCase()
    .regex(/^[A-Z0-9-]{5,20}$/, "Enter a valid booking reference"),
  email: emailField,
});

export default bookingLookupSchema;
