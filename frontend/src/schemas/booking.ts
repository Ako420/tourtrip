import { z } from "zod";
import { emailField } from "./fields";

const nameField = (label: string) => {
  return z.string().trim().min(2, `Enter your ${label}`).max(60, `${label} must be 60 characters or fewer`);
};

const bookingSchema = z.object({
  firstName: nameField("first name"),
  lastName: nameField("last name"),
  email: emailField,
  phone: z
    .string()
    .trim()
    .min(1, "Enter your phone number")
    .regex(/^\+?[0-9 ()-]{7,20}$/, "Enter a valid phone number"),
  arrivalTime: z.string().optional(),
  specialRequests: z.string().trim().max(500, "Requests must be 500 characters or fewer").optional(),
  acceptTerms: z.literal("on", { error: "Accept the booking terms to continue" }),
});

export default bookingSchema;
