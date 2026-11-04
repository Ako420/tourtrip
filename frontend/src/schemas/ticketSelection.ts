import { z } from "zod";

const ticketSelectionSchema = z
  .object({
    date: z.string().min(1, "Choose a visit date"),
    today: z.string(),
    adults: z.number().int().min(1, "Add at least one adult"),
    children: z.number().int().min(0),
  })
  .refine((values) => values.date >= values.today, {
    message: "Choose a date from today onwards",
    path: ["date"],
  });

export default ticketSelectionSchema;
