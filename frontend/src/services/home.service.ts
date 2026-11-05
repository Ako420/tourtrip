import { homeContent, homeDestinations } from "@/data";
import type { HomeContent, HomeDestination } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getHomeContent = async (): Promise<HomeContent> => {
  return isApiLive("content") ? apiGet<HomeContent>("/home") : homeContent;
};

export const getHomeDestinations = async (): Promise<HomeDestination[]> => {
  return isApiLive("content") ? apiGet<HomeDestination[]>("/home/destinations") : homeDestinations;
};
