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
      {
        id: "rome",
        name: "Rome",
        imageUrl: unsplashImage("photo-1552832230-c0197dd311b5", 900),
        links: [
          { label: "Things to do", href: toSearchHref("Rome") },
          { label: "Top rated", href: "/attractions?q=Rome&sort=rating#results" },
          { label: "Free cancellation", href: "/attractions?q=Rome&freeCancellation=true#results" },
        ],
      },
      { id: "tokyo", name: "Tokyo", imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 600) },
      { id: "cape-town", name: "Cape Town", imageUrl: unsplashImage("photo-1580060839134-75a5edca2e99", 600) },
      { id: "dubai", name: "Dubai", imageUrl: unsplashImage("photo-1512453979798-5ea266f8880c", 600) },
      { id: "bali", name: "Bali", imageUrl: unsplashImage("photo-1537996194471-e657df975ab4", 600) },
    ],
  },
  offer: {
    title: "Join Hotel Jr for free",
    points: ["Fill in booking forms faster with your saved details", "Chat with the travel assistant about your trip"],
    ctaLabel: "Create an account",
    ctaHref: "/signup?next=%2Fattractions",
  },
  banners: [
    { id: "landmarks", eyebrow: "Landmarks", title: "Icons worth the trip", subtitle: "Ancient sites and famous views", href: "/attractions?category=landmarks#results", ctaLabel: "Explore", imageUrl: unsplashImage("photo-1553913861-c0fddf2619ee", 800), theme: "sunset" },
    { id: "flexible", eyebrow: "Flexible plans", title: "Free cancellation", subtitle: "Tickets you can cancel", href: "/attractions?freeCancellation=true#results", ctaLabel: "See tickets", imageUrl: unsplashImage("photo-1570077188670-e3a8d69ac5ff", 800), theme: "primary" },
    { id: "guides", eyebrow: "Stay inspired", title: "Plan with a guide", subtitle: "City guides for your next trip", href: "/inspiration", ctaLabel: "Read guides", imageUrl: unsplashImage("photo-1597212618440-806262de4f6b", 800), theme: "sunset" },
  ],
  recommended: {
    title: "Recommended for you",
    items: [
      { id: "landmarks", title: "Landmarks", category: "landmarks", imageUrl: unsplashImage("photo-1526392060635-9d6019884377", 600) },
      { id: "city", title: "City breaks", category: "city", imageUrl: unsplashImage("photo-1512453979798-5ea266f8880c", 600) },
      { id: "nature", title: "Nature", category: "nature", imageUrl: unsplashImage("photo-1531366936337-7c912a4589a7", 600) },
      { id: "adventure", title: "Adventure", category: "adventure", imageUrl: unsplashImage("photo-1641128324972-af3212f0f6bd", 600) },
    ],
  },
  resultsTitle: "Popular things to do",
  benefits: [
    { id: "explore", title: "Places worth the trip", description: "Browse landmarks, nature and adventure around the world.", iconName: "compass" },
    { id: "prices", title: "Clear ticket prices", description: "See adult and child prices before you book.", iconName: "tag" },
    { id: "cancel", title: "Flexible options", description: "Filter for tickets with free cancellation.", iconName: "shield" },
    { id: "currency", title: "Prices in your currency", description: "Choose your currency from the top of the page.", iconName: "globe" },
  ],
  recommendations: {
    title: "Hotel Jr picks",
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
      {
        id: "experiences",
        label: "Unique experiences",
        links: [
          { label: "Cappadocia balloon flight", href: "/attractions/cappadocia-balloon" },
          { label: "Northern lights tour", href: "/attractions/northern-lights" },
          { label: "Savanna safari drive", href: "/attractions/savanna-safari" },
          { label: "Alpine lake boat trip", href: "/attractions/alpine-lake" },
          { label: "Table Mountain views", href: "/attractions/table-mountain" },
        ],
      },
    ],
  },
};

export default attractionsContent;
