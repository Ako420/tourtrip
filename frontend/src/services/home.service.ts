import { homeContent } from "@/data";
import type { HomeContent } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getHomeContent = async (): Promise<HomeContent> => {
  return isApiLive("content") ? apiGet<HomeContent>("/home") : homeContent;
};
