import type { IconName } from "@/constants";
import type { FlightTip } from "./flight";

export type RewardTier = {
  id: string;
  name: string;
  coinBoost: number;
  howToReach: string;
  howToKeep: string;
  plannedPerks: string[];
};

export type RewardEarnRate = {
  id: string;
  label: string;
  coinsPer100: number;
  iconName: IconName;
};

export type RewardsProgram = {
  tiers: RewardTier[];
  earnRates: RewardEarnRate[];
  faqs: FlightTip[];
};
