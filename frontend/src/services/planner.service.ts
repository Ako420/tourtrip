import { attractions, plannerContent } from "@/data";
import type { PlannerSuggestion } from "@/types";
import { apiGet, isApiEnabled } from "./http";

export const getPlannerContent = async (): Promise<typeof plannerContent> => {
  return isApiEnabled ? apiGet<typeof plannerContent>("/planner/content") : plannerContent;
};

export const getPlannerSuggestions = async (): Promise<PlannerSuggestion[]> => {
  if (isApiEnabled) {
    return apiGet<PlannerSuggestion[]>("/planner/suggestions");
  }

  return attractions.map(({ id, slug, name, city, country, imageUrl, duration, price, currency }) => ({
    id,
    slug,
    name,
    city,
    country,
    imageUrl,
    duration,
    price: Number(price),
    currency,
  }));
};
