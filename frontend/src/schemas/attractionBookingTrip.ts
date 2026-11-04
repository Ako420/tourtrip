import { z } from "zod";
import { ticketLimits } from "@/constants";

const attractionBookingTripSchema = z.object({
  slug: z.string().min(1),
  ticketId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  adults: z.number().int().min(ticketLimits.adults.min).max(ticketLimits.adults.max),
  children: z.number().int().min(ticketLimits.children.min).max(ticketLimits.children.max),
});

export default attractionBookingTripSchema;
