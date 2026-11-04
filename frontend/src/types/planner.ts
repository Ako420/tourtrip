import type { z } from "zod";
import type { planActivitySchema, tripPlanSchema, tripSetupSchema } from "@/schemas";

export type TripPlan = z.infer<typeof tripPlanSchema>;
export type PlanDay = TripPlan["days"][number];
export type PlanItem = PlanDay["items"][number];
export type TripSetup = z.infer<typeof tripSetupSchema>;
export type PlanActivity = z.infer<typeof planActivitySchema>;

export type PlannerSuggestion = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  imageUrl: string;
  duration: string;
  price: number;
  currency: string;
};
