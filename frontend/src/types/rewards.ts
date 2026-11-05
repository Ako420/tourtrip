import type { IconName } from "@/constants";
import type { FlightTip } from "./flight";

export type RewardTier = {
  id: string;
  name: string;
  coinBoost: number;
  howToReach: string;
  howToKeep: string;
};

export type RewardPerk = {
  id: string;
  label: string;
  iconName: IconName;
  // One value per tier, in tier order. An empty value means the tier does not get the perk.
  values: string[];
};

export type RewardEarnRate = {
  id: string;
  label: string;
  coinsPer100: number;
  iconName: IconName;
};

export type RewardFaqGroup = {
  id: string;
  label: string;
  intro?: string;
  items: FlightTip[];
};

export type RewardsHeadingCopy = {
  eyebrow: string;
  title: string;
  note: string;
};

export type RewardsProgram = {
  hero: { title: string; subtitle: string };
  membership: {
    title: string;
    note: string;
    memberNote: string;
    guest: { title: string; detail: string };
    member: { title: string; detail: string };
  };
  joinLabel: string;
  why: RewardsHeadingCopy;
  tiers: RewardTier[];
  perks: RewardPerk[];
  earn: RewardsHeadingCopy & { productsTitle: string; tiersTitle: string };
  earnRates: RewardEarnRate[];
  spend: RewardsHeadingCopy & { appliesTo: string[]; example: { label: string; amount: string } };
  progress: RewardsHeadingCopy;
  faqs: { title: string; groups: RewardFaqGroup[] };
  closingTitle: string;
};
