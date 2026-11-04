import { z } from "zod";

const planItemSchema = z.object({
  id: z.string(),
  suggestionId: z.string().optional(),
  title: z.string(),
  time: z.string().optional(),
  cost: z.number(),
  note: z.string().optional(),
  href: z.string().optional(),
});

// Saved plans come back from the browser, so they are checked before use.
const tripPlanSchema = z.object({
  destination: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  style: z.enum(["relaxed", "balanced", "packed"]),
  currency: z.string(),
  days: z.array(z.object({ date: z.string(), items: z.array(planItemSchema) })),
});

export default tripPlanSchema;
