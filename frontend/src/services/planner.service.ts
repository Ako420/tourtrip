import { attractions, plannerContent } from "@/data";
import type { PlannerSuggestion } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getPlannerContent = async (): Promise<typeof plannerContent> => {
  return isApiLive("content") ? apiGet<typeof plannerContent>("/planner/content") : plannerContent;
};

export const getPlannerSuggestions = async (): Promise<PlannerSuggestion[]> => {
  if (isApiLive("attractions")) {
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
