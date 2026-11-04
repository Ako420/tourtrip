import { homeContent } from "@/data";
import type { HomeContent } from "@/types";
import { apiGet, isApiEnabled } from "./http";

export const getHomeContent = async (): Promise<HomeContent> => {
  return isApiEnabled ? apiGet<HomeContent>("/home") : homeContent;
};
