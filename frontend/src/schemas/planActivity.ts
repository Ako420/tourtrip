import { z } from "zod";

const planActivitySchema = z.object({
  title: z.string().trim().min(2, "Enter an activity").max(80, "Use 80 characters or fewer"),
  time: z.string().optional(),
  cost: z.preprocess(
    (value) => (value === "" || value === undefined ? 0 : Number(value)),
    z.number({ error: "Enter a number" }).min(0, "Cost cannot be negative").max(100_000, "Enter a lower cost"),
  ),
  note: z.string().trim().max(200, "Use 200 characters or fewer").optional(),
});

export default planActivitySchema;
