import type { HotelsContent, LinkItem } from "@/types";
import supportFaqs from "./supportFaqs";
import unsplashImage from "./unsplashImage";

const cityLinks = (cities: string[]): LinkItem[] => {
  return cities.map((city) => ({ label: `Hotels in ${city}`, href: `/hotels/list?destination=${encodeURIComponent(city)}` }));
};

const sightLinks = (sights: [name: string, city: string][]): LinkItem[] => {
  return sights.map(([name, city]) => ({ label: `Hotels near ${name}`, href: `/hotels/list?destination=${encodeURIComponent(city)}` }));
};

// Same shape as GET /hotels/content. Used until API_URL is set.
const hotelsContent: HotelsContent = {
  hero: {
    title: "Hotels & Homes",
    imageUrl: unsplashImage("photo-1570077188670-e3a8d69ac5ff", 2000),
  },
  offer: {
    title: "Join Hotel Jr for free",
    points: ["Fill in booking forms faster with your saved details", "Chat with the travel assistant about your trip"],
    ctaLabel: "Create an account",
    ctaHref: "/signup?next=%2Fhotels",
  },
  whatsNewTitle: "What's new",
  benefits: [
    { id: "compare", title: "Compare stays", description: "See prices, ratings and rooms side by side before you book.", iconName: "bed" },
    { id: "cancel", title: "Flexible options", description: "Filter for rooms with free cancellation or breakfast included.", iconName: "check" },
    { id: "plan", title: "Plan the whole trip", description: "Add things to do and build a day-by-day plan for free.", iconName: "route" },
  ],
  showcases: {
    luxuryTitle: "Top 5-star stays",
    budgetTitle: "Great value stays",
    popularTitle: "Guest favorites",
  },
  faqs: {
    title: "Hotel questions",
    items: supportFaqs.filter((faq) => faq.product === "hotels"),
  },
  statsTitle: "Stays at a glance",
  about: {
    title: "Stays on Hotel Jr",
    paragraphs: [
      "Hotel Jr brings hotels and homes together in one place, so you can search by destination and dates, compare what each stay offers, and book when it feels right.",
      "Use the filters on the results page to narrow things down by budget, guest rating, star rating and amenities. Each hotel page shows its rooms, policies, reviews and what is nearby.",
    ],
  },
  recommendations: {
    title: "Recommendations",
    items: [
      {
        id: "destinations",
        label: "Top destinations",
        links: cityLinks(["Bali", "Tokyo", "Paris", "Rome", "Dubai", "Cape Town", "Marrakech", "Singapore", "Nairobi", "Lisbon", "Phuket", "Hong Kong"]),
      },
      {
        id: "sights",
        label: "Hotels near famous sights",
        links: sightLinks([
          ["the Eiffel Tower", "Paris"],
          ["the Colosseum", "Rome"],
          ["Table Mountain", "Cape Town"],
          ["Nairobi National Park", "Nairobi"],
        ]),
      },
      {
        id: "explore",
        label: "Explore more",
        links: [
          { label: "All hotels", href: "/hotels/list" },
          { label: "Hotel deals", href: "/deals" },
          { label: "Flight + Hotel", href: "/packages" },
          { label: "City guides", href: "/inspiration" },
          { label: "Trip planner", href: "/planner" },
        ],
      },
    ],
  },
};

export default hotelsContent;
