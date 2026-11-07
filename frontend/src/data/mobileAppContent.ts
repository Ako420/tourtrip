import type { MobileAppContent } from "@/types";

// Same shape as GET /app/content. Used until API_URL is set.
const mobileAppContent: MobileAppContent = {
  hero: {
    title: "Hotel Jr on your phone",
    subtitle: "We are planning a Hotel Jr app to keep your whole trip in your pocket.",
    status: "Not available yet. There is nothing to download today.",
  },
  planned: {
    title: "What we plan to include",
    moreLabel: "",
    items: [
      { id: "trips", title: "All your trips", description: "See every booking in one place.", iconName: "ticket" },
      { id: "updates", title: "Trip updates", description: "Get news about your bookings as it happens.", iconName: "plane" },
      { id: "assistant", title: "Travel assistant", description: "Ask for ideas and tips wherever you are.", iconName: "robot" },
      { id: "planner", title: "Your trip plan", description: "Keep your day-by-day plan close at hand.", iconName: "route" },
    ],
  },
  today: {
    title: "Use Hotel Jr on your phone today",
    items: [
      {
        id: "bookings",
        title: "Find your booking",
        description: "Look up a trip in your phone's browser.",
        href: "/bookings",
        iconName: "ticket",
      },
      {
        id: "planner",
        title: "Plan your trip",
        description: "Build a day-by-day plan for free.",
        href: "/planner",
        iconName: "route",
      },
      {
        id: "assistant",
        title: "Ask the assistant",
        description: "Get ideas and tips for your trip.",
        href: "/assistant",
        iconName: "robot",
      },
    ],
  },
};

export default mobileAppContent;
