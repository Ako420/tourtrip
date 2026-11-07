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
  { id: "chat", title: "Travel assistant", description: "Chat about your trip.", href: "/assistant", iconName: "headset" },
  { id: "booking", title: "Find your booking", description: "Look up a trip with your reference and email.", href: "/bookings", iconName: "ticket" },
  { id: "cancellation", title: "Changes and cancellations", description: "Read how changes and refunds work.", href: "/terms#changes", iconName: "info" },
  { id: "message", title: "Send us a message", description: "Tell us what happened and how we can help.", href: "#contact", iconName: "send" },
];

export const supportGuarantee = {
  title: "Know the rules before you book",
  body: "Every booking shows its price and cancellation rules before you confirm it.",
  linkLabel: "Read our terms",
  href: "/terms",
};

export const supportSteps = {
  title: "It's easy to get help on Hotel Jr",
  items: [
    { id: "answer", title: "Find your answer", description: "Choose a topic above, or search the help topics." },
    { id: "assistant", title: "Ask the assistant", description: "Sign in and chat with the travel assistant about your trip." },
    { id: "message", title: "Send us a message", description: "Give us the details and add your booking reference if you have one." },
  ],
};

export const supportTopics = [
  { value: "booking", label: "A booking I made" },
  { value: "change", label: "Changing or cancelling" },
  { value: "payment", label: "Prices and payment" },
  { value: "account", label: "My account" },
  { value: "other", label: "Something else" },
] as const;
