import { z } from "zod";
import { enquiryLimits } from "@/constants";
import { emailField } from "./fields";

const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100, "Name must be 100 characters or fewer"),
  email: emailField,
  date: z.iso.date("Choose a date"),
  travelers: z.coerce
    .number("Enter the number of travelers")
    .int("Enter a whole number")
    .min(enquiryLimits.minTravelers, "Enter at least 1 traveler")
    .max(enquiryLimits.maxTravelers, `For more than ${enquiryLimits.maxTravelers} travelers, tell us in your message`),
  message: z.string().trim().max(1000, "Message must be 1000 characters or fewer").optional(),
});

export default enquirySchema;
