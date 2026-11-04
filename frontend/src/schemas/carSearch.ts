import { z } from "zod";
import { MAX_RENTAL_DAYS } from "@/constants";
import { getRentalHours } from "@/lib/carSearch";

const carSearchSchema = z
  .object({
    location: z.string().trim().min(2, "Enter a pick-up location"),
    hasDifferentDropoff: z.boolean(),
    dropoffLocation: z.string().trim().optional(),
    pickupDate: z.string().min(1, "Choose a pick-up date"),
    pickupTime: z.string(),
    dropoffDate: z.string().min(1, "Choose a drop-off date"),
    dropoffTime: z.string(),
  })
  .refine((values) => !values.hasDifferentDropoff || (values.dropoffLocation ?? "").length >= 2, {
    message: "Enter a drop-off location",
    path: ["dropoffLocation"],
  })
  .refine((values) => getRentalHours(values) > 0, {
    message: "Drop-off must be after pick-up",
    path: ["dropoffDate"],
  })
  .refine((values) => getRentalHours(values) <= MAX_RENTAL_DAYS * 24, {
    message: `Rentals can be up to ${MAX_RENTAL_DAYS} days`,
    path: ["dropoffDate"],
  });

export default carSearchSchema;
