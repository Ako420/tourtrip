import { z } from "zod";
import { cabinOptions } from "@/constants";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const flightBookingTripSchema = z.object({
  offerId: z.string().min(1),
  from: z.string().min(2),
  to: z.string().min(2),
  tripType: z.enum(["round-trip", "one-way"]),
  isNonstop: z.boolean(),
  departDate: isoDate,
  returnDate: isoDate.optional(),
  adults: z.number().int().min(1).max(9),
  children: z.number().int().min(0).max(8),
  cabin: z.enum(cabinOptions),
});

export default flightBookingTripSchema;
