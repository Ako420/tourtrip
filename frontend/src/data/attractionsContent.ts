import type { AttractionsContent } from "@/types";
import unsplashImage from "./unsplashImage";

const toSearchHref = (query: string) => `/attractions?q=${encodeURIComponent(query)}#results`;

// Same shape as GET /attractions/content. Used until API_URL is set.
const attractionsContent: AttractionsContent = {
  hero: {
    title: "Attractions & Tours",
    subtitle: "Find places to see and things to do",
    imageUrl: unsplashImage("photo-1476514525535-07fb3b4ae5f1", 2000),
  },
  quickSearches: ["Rome", "Paris", "Tokyo", "Cape Town", "Bali", "Dubai", "Nairobi"],
  trending: {
    title: "Trending destinations",
    items: [
      { id: "rome", name: "Rome", imageUrl: unsplashImage("photo-1552832230-c0197dd311b5", 900) },
      { id: "tokyo", name: "Tokyo", imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 600) },
      { id: "cape-town", name: "Cape Town", imageUrl: unsplashImage("photo-1580060839134-75a5edca2e99", 600) },
      { id: "dubai", name: "Dubai", imageUrl: unsplashImage("photo-1512453979798-5ea266f8880c", 600) },
      { id: "bali", name: "Bali", imageUrl: unsplashImage("photo-1537996194471-e657df975ab4", 600) },
    ],
  },
  resultsTitle: "Popular things to do",
  recommendations: {
    title: "Explore more",
    items: [
      {
        id: "cities",
        label: "Things to do by city",
        links: ["Rome", "Paris", "Tokyo", "Cairo", "Dubai", "Sydney", "Beijing", "Bali", "Nairobi", "Cape Town"].map(
          (city) => ({ label: `Things to do in ${city}`, href: toSearchHref(city) }),
        ),
      },
      {
        id: "countries",
        label: "Things to do by country",
        links: ["Italy", "France", "Japan", "Egypt", "Peru", "Kenya", "Greece", "Norway"].map((country) => ({
          label: `Things to do in ${country}`,
          href: toSearchHref(country),
        })),
      },
    ],
  },
};

export default attractionsContent;
