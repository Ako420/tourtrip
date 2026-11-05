import { rewardsProgram } from "@/data";
import type { RewardsProgram } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getRewardsProgram = async (): Promise<RewardsProgram> => {
  return isApiLive("rewards") ? apiGet<RewardsProgram>("/rewards/tiers") : rewardsProgram;
};
