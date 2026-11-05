import type { SupportOption, SupportProduct } from "@/types";

export const supportProducts: SupportProduct[] = [
  { id: "hotels", label: "Hotels & Homes", iconName: "bed" },
  { id: "flights", label: "Flights", iconName: "plane" },
  { id: "trains", label: "Trains", iconName: "train" },
  { id: "cars", label: "Car Rentals", iconName: "car" },
  { id: "attractions", label: "Attractions & Tours", iconName: "ticket" },
  { id: "account", label: "Your account", iconName: "user" },
];

export const supportOptions: SupportOption[] = [
  {
    id: "booking",
    title: "Find your booking",
    description: "Look up a trip with your reference and email.",
    href: "/bookings",
    iconName: "ticket",
  },
  {
    id: "cancellation",
    title: "Changes and cancellations",
    description: "Read how changes and refunds work.",
    href: "/terms#changes",
    iconName: "info",
  },
  {
    id: "message",
    title: "Send us a message",
    description: "Tell us what happened and how we can help.",
    href: "#contact",
    iconName: "send",
  },
];

export const supportTopics = [
  { value: "booking", label: "A booking I made" },
  { value: "change", label: "Changing or cancelling" },
  { value: "payment", label: "Prices and payment" },
  { value: "account", label: "My account" },
  { value: "other", label: "Something else" },
] as const;
