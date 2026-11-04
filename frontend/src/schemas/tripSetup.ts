import { z } from "zod";
import { MAX_TRIP_DAYS } from "@/constants";
import { nightsBetween } from "@/lib/dates";

const tripSetupSchema = z
  .object({
    destination: z.string().trim().min(2, "Enter a destination").max(60, "Use 60 characters or fewer"),
    startDate: z.string().min(1, "Choose a start date"),
    endDate: z.string().min(1, "Choose an end date"),
    style: z.enum(["relaxed", "balanced", "packed"]),
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  })
  .refine((values) => nightsBetween(values.startDate, values.endDate) < MAX_TRIP_DAYS, {
    message: `Trips can be up to ${MAX_TRIP_DAYS} days`,
    path: ["endDate"],
  });

export default tripSetupSchema;
