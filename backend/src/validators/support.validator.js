import { z } from "zod";
import { emailField } from "../utils/validators.js";

const TOPICS = ["booking", "change", "payment", "account", "other"];

const BOOKING_REFERENCE = /^[A-Z0-9-]{5,20}$/;

export const supportTicketSchema = z.object({
  fullName: z
    .string("Enter your full name")
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Name must be 100 characters or fewer"),
  email: emailField,
  topic: z.enum(TOPICS, "Choose a topic"),
  bookingReference: z
    .string("Enter a valid booking reference")
    .trim()
    .toUpperCase()
    .refine((value) => !value || BOOKING_REFERENCE.test(value), "Enter a valid booking reference")
    .optional()
    .transform((value) => value || null),
  message: z
    .string("Tell us a little more, at least 20 characters")
    .trim()
    .min(20, "Tell us a little more, at least 20 characters")
    .max(2000, "Message must be 2000 characters or fewer"),
});
