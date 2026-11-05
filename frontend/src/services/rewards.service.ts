import { rewardsProgram } from "@/data";
import type { RewardsProgram } from "@/types";
import { apiGet, isApiEnabled } from "./http";

export const getRewardsProgram = async (): Promise<RewardsProgram> => {
  return isApiEnabled ? apiGet<RewardsProgram>("/rewards/tiers") : rewardsProgram;
};
