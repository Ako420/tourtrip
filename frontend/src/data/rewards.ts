import type { RewardsProgram } from "@/types";

// Same shape as GET /rewards/tiers. Used until API_URL is set.
const rewardsProgram: RewardsProgram = {
  tiers: [
    { id: "silver", name: "Silver", coinBoost: 0, howToReach: "Sign up", howToKeep: "Permanent", plannedPerks: [] },
    { id: "gold", name: "Gold", coinBoost: 20, howToReach: "1 eligible booking", howToKeep: "Permanent", plannedPerks: [] },
    { id: "platinum", name: "Platinum", coinBoost: 50, howToReach: "3 eligible bookings", howToKeep: "3 eligible bookings a year", plannedPerks: ["1 airport lounge visit", "1GB eSIM data for 3 days"] },
    { id: "diamond", name: "Diamond", coinBoost: 100, howToReach: "8 eligible bookings, US$1,000 total", howToKeep: "The same, each year", plannedPerks: ["2 airport lounge visits", "3GB eSIM data for 5 days", "2 airport transfer upgrades", "2 train refunds with no admin fee"] },
    { id: "diamond-plus", name: "Diamond+", coinBoost: 150, howToReach: "US$10,000 total", howToKeep: "The same, each year", plannedPerks: ["3 airport lounge visits", "2 eSIM data packs", "4 airport transfer upgrades", "4 train refunds with no admin fee", "1 free attraction ticket"] },
    { id: "black-diamond", name: "Black Diamond", coinBoost: 200, howToReach: "Invitation only", howToKeep: "Over US$20,000 a year", plannedPerks: ["12 airport lounge visits", "8 eSIM data packs", "8 airport transfer upgrades", "8 train refunds with no admin fee", "1 free attraction ticket"] },
  ],
  earnRates: [
    { id: "hotels", label: "Hotels & Homes", coinsPer100: 50, iconName: "bed" },
    { id: "cruises", label: "Cruises", coinsPer100: 50, iconName: "ship" },
    { id: "packages", label: "Flight + Hotel", coinsPer100: 35, iconName: "building" },
    { id: "flights", label: "Flights", coinsPer100: 20, iconName: "plane" },
    { id: "trains", label: "Trains", coinsPer100: 20, iconName: "train" },
    { id: "cars", label: "Car rentals", coinsPer100: 15, iconName: "car" },
    { id: "tours", label: "Tours", coinsPer100: 15, iconName: "compass" },
    { id: "attractions", label: "Attractions", coinsPer100: 15, iconName: "ticket" },
  ],
  faqs: [
    {
      id: "count",
      question: "When does a booking count?",
      answer: "A booking counts once your trip is complete. Cancelled bookings do not count, and free bookings earn no coins.",
    },
    {
      id: "value",
      question: "What are Jr Coins worth?",
      answer: "100 Jr Coins are worth about US$1 off a booking. You need a verified email to spend them.",
    },
    {
      id: "expiry",
      question: "Do Jr Coins expire?",
      answer: "Coins from bookings last 18 months. Coins from reviews last 6 months.",
    },
    {
      id: "reviews",
      question: "Can I earn coins from reviews?",
      answer: "Yes. Longer reviews earn more, with extra coins for adding a photo. You can earn up to 1,200 review coins a month.",
    },
    {
      id: "downgrade",
      question: "Can I lose my tier?",
      answer: "Platinum and above are checked each year. If you miss the rule you move down, but never below Gold.",
    },
  ],
};

export default rewardsProgram;
