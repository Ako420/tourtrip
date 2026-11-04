import { z } from "zod";
import { passengerLimits, seatClasses } from "@/constants";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const trainBookingTripSchema = z.object({
  offerId: z.string().min(1),
  from: z.string().min(2),
  to: z.string().min(2),
  tripType: z.enum(["round-trip", "one-way"]),
  departDate: isoDate,
  returnDate: isoDate.optional(),
  adults: z.number().int().min(passengerLimits.adults.min).max(passengerLimits.adults.max),
  children: z.number().int().min(passengerLimits.children.min).max(passengerLimits.children.max),
  seatClass: z.enum(seatClasses),
});

export default trainBookingTripSchema;
