import { mobileAppContent } from "@/data";
import type { MobileAppContent } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getMobileAppContent = async (): Promise<MobileAppContent> => {
  return isApiLive("content") ? apiGet<MobileAppContent>("/app/content") : mobileAppContent;
};
