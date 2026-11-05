import { z } from "zod";
import { supportTopics } from "@/constants";
import { emailField } from "./fields";

const supportTicketSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100, "Name must be 100 characters or fewer"),
  email: emailField,
  topic: z.enum(supportTopics.map((topic) => topic.value), { error: "Choose a topic" }),
  bookingReference: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{5,20}$/, "Enter a valid booking reference")
    .or(z.literal(""))
    .optional(),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more, at least 20 characters")
    .max(2000, "Message must be 2000 characters or fewer"),
});

export default supportTicketSchema;
