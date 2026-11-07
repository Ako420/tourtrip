import type { PackagesContent } from "@/types";
import unsplashImage from "./unsplashImage";

// Same shape as GET /packages/content. Used until API_URL is set.
const packagesContent: PackagesContent = {
  hero: {
    title: "Flight + Hotel",
    imageUrl: unsplashImage("photo-1571896349842-33c89424de2d", 2000),
  },
  benefits: [
    { id: "save", title: "Pay less", description: "Get 6% off the full price of your flight and hotel.", iconName: "tag" },
    { id: "reference", title: "One booking", description: "A single reference covers your flight and your stay.", iconName: "ticket" },
    { id: "stays", title: "Compare stays", description: "See every hotel with its full package price.", iconName: "bed" },
  ],
  deals: {
    title: "Daily deals",
    note: "Sample prices for one adult. Online payment is not connected yet.",
    routes: [
      { from: "London", to: "Paris", daysAhead: 10, nights: 3 },
      { from: "Lagos", to: "Dubai", daysAhead: 14, nights: 4 },
      { from: "Hong Kong", to: "Tokyo", daysAhead: 21, nights: 3 },
      { from: "London", to: "Rome", daysAhead: 24, nights: 3 },
      { from: "Dubai", to: "Cape Town", daysAhead: 30, nights: 5 },
      { from: "Hong Kong", to: "Bali", daysAhead: 35, nights: 4 },
    ],
  },
};

export default packagesContent;
