import type { RewardsProgram } from "@/types";

// Same shape as GET /rewards/tiers. Used until API_URL is set.
const rewardsProgram: RewardsProgram = {
  hero: { title: "Hotel Jr Rewards", subtitle: "Hotel Jr's loyalty program" },
  membership: {
    title: "Unlock more member rewards",
    note: "Rewards are not connected yet, so bookings do not earn coins today.",
    memberNote: "Rewards are not connected yet. Your tier, progress and Jr Coins will show here when they are.",
    guest: { title: "Guest", detail: "Basic rewards" },
    member: { title: "Hotel Jr Member", detail: "Extra Jr Coins, travel perks and more" },
  },
  joinLabel: "Join now - it's free",
  why: {
    eyebrow: "Why join?",
    title: "Members earn more on every tier",
    note: "Planned perks depend on travel partners and are not available yet.",
  },
  tiers: [
    { id: "silver", name: "Silver", coinBoost: 0, howToReach: "Sign up", howToKeep: "Permanent" },
    { id: "gold", name: "Gold", coinBoost: 20, howToReach: "1 eligible booking", howToKeep: "Permanent" },
    { id: "platinum", name: "Platinum", coinBoost: 50, howToReach: "3 eligible bookings", howToKeep: "3 eligible bookings a year" },
    { id: "diamond", name: "Diamond", coinBoost: 100, howToReach: "8 eligible bookings, US$1,000 total", howToKeep: "The same, each year" },
    { id: "diamond-plus", name: "Diamond+", coinBoost: 150, howToReach: "US$10,000 total", howToKeep: "The same, each year" },
    { id: "black-diamond", name: "Black Diamond", coinBoost: 200, howToReach: "Invitation only", howToKeep: "Over US$20,000 a year" },
  ],
  perks: [
    { id: "coins", label: "Earn Jr Coins", iconName: "coins", values: ["Earn Jr Coins", "Earn 20% more", "Earn 50% more", "Earn 100% more", "Earn 150% more", "Earn 200% more"] },
    { id: "lounge", label: "Airport lounge visits", iconName: "plane", values: ["", "", "1 time", "2 times", "3 times", "12 times"] },
    { id: "esim", label: "eSIM data", iconName: "phone", values: ["", "", "1GB, 3 days", "3GB, 5 days", "2 packs", "8 packs"] },
    { id: "transfer", label: "Airport transfer upgrades", iconName: "car", values: ["", "", "", "2 times", "4 times", "8 times"] },
    { id: "train", label: "Train refunds with no admin fee", iconName: "train", values: ["", "", "", "2 times", "4 times", "8 times"] },
    { id: "ticket", label: "Free attraction ticket", iconName: "ticket", values: ["", "", "", "", "1 ticket", "1 ticket"] },
  ],
  earn: {
    eyebrow: "Special rewards",
    title: "Earn extra Jr Coins",
    note: "",
    productsTitle: "Start earning Jr Coins with your bookings",
    tiersTitle: "The higher your tier, the more Jr Coins you earn",
  },
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
  spend: {
    eyebrow: "Instant savings",
    title: "Use Jr Coins to save on bookings",
    note: "100 Jr Coins are worth about US$1.",
    appliesTo: ["Hotels & Homes", "Flights", "Trains", "Car rentals", "Attractions", "Tours"],
    example: { label: "Jr Coins", amount: "-$10" },
  },
  progress: {
    eyebrow: "How it works",
    title: "The more you book, the higher you go",
    note: "A booking counts toward your next tier once your trip is complete.",
  },
  faqs: {
    title: "FAQs",
    groups: [
      {
        id: "tiers",
        label: "Member tier",
        intro: "There are 6 tiers: Silver, Gold, Platinum, Diamond, Diamond+ and Black Diamond.",
        items: [
          { id: "count", question: "When does a booking count?", answer: "A booking counts once your trip is complete. Cancelled bookings do not count, and free bookings earn no coins." },
          { id: "keep", question: "How do I keep my tier?", answer: "Silver and Gold are permanent. Platinum and above need the same activity each year." },
          { id: "downgrade", question: "Can I lose my tier?", answer: "Platinum and above are checked each year. If you miss the rule you move down, but never below Gold." },
        ],
      },
      {
        id: "rewards",
        label: "Member rewards",
        items: [
          { id: "perks", question: "Can I use these perks today?", answer: "Not yet. Planned perks depend on travel partners and are not available yet." },
        ],
      },
      {
        id: "coins",
        label: "Jr Coins",
        items: [
          { id: "value", question: "What are Jr Coins worth?", answer: "100 Jr Coins are worth about US$1 off a booking. You need a verified email to spend them." },
          { id: "expiry", question: "Do Jr Coins expire?", answer: "Coins from bookings last 18 months. Coins from reviews last 6 months." },
          { id: "reviews", question: "Can I earn coins from reviews?", answer: "Yes. Longer reviews earn more, with extra coins for adding a photo. You can earn up to 1,200 review coins a month." },
        ],
      },
    ],
  },
  closingTitle: "Start a rewarding journey today",
};

export default rewardsProgram;
