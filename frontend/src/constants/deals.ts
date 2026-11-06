import type { TrustItem } from "@/types";

export const dealProducts = [
  { id: "all", label: "All" },
  { id: "hotels", label: "Hotels", iconName: "bed" },
  { id: "flights", label: "Flights", iconName: "plane" },
  { id: "attractions", label: "Attractions", iconName: "ticket" },
] as const;

export const dealBenefits: TrustItem[] = [
  { id: "together", title: "One place for your trip", description: "Book hotels, flights and tickets together on Hotel Jr.", iconName: "suitcase" },
  { id: "bookings", title: "All your bookings", description: "Find every booking in one place, any time you need it.", iconName: "calendar" },
  { id: "support", title: "Help when you need it", description: "Contact customer support about your trip.", iconName: "headset" },
];
