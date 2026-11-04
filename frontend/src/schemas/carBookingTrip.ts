import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const time = z.string().regex(/^\d{2}:\d{2}$/);

const carBookingTripSchema = z.object({
  offerId: z.string().min(1),
  location: z.string().min(2),
  dropoffLocation: z.string().min(2).optional(),
  pickupDate: isoDate,
  pickupTime: time,
  dropoffDate: isoDate,
  dropoffTime: time,
  isStandardAge: z.boolean(),
});

export default carBookingTripSchema;
