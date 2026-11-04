import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const count = (min: number, max: number) => z.number().int().min(min).max(max);

const bookingStaySchema = z.object({
  slug: z.string().min(1),
  roomId: z.string().min(1),
  checkIn: isoDate,
  checkOut: isoDate,
  rooms: count(1, 8),
  adults: count(1, 16),
  children: count(0, 10),
});

export default bookingStaySchema;
