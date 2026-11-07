import { z } from "zod";
import { cabinOptions } from "@/constants";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const packageBookingTripSchema = z.object({
  flightId: z.string().min(1),
  hotelSlug: z.string().min(1),
  roomId: z.string().min(1),
  from: z.string().min(2),
  to: z.string().min(2),
  departDate: isoDate,
  returnDate: isoDate,
  adults: z.number().int().min(1).max(9),
  children: z.number().int().min(0).max(8),
  cabin: z.enum(cabinOptions),
  rooms: z.number().int().min(1).max(8),
});

export default packageBookingTripSchema;
