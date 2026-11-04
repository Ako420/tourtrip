import type { TrainRoute, TrainsContent } from "@/types";
import unsplashImage from "./unsplashImage";

const route = (
  id: string,
  from: string,
  to: string,
  duration: string,
  fromPrice: number,
  photoId: string,
): TrainRoute => {
  return { id, from, to, duration, fromPrice, currency: "USD", imageUrl: unsplashImage(photoId, 600) };
};

// Same shape as GET /trains/content. Used until API_URL is set. Prices and times are sample values.
const trainsContent: TrainsContent = {
  hero: {
    title: "Train tickets",
    subtitle: "Compare routes and travel by rail",
    imageUrl: unsplashImage("photo-1532105956626-9569c03602f6", 2000),
  },
  trust: {
    title: "Why book trains with us",
    moreLabel: "Register now",
    moreHref: "/signup",
    items: [
      { id: "compare", title: "All in one search", description: "See times and fares side by side for your journey.", iconName: "search" },
      { id: "price", title: "Clear pricing", description: "See the full price for your group before you book.", iconName: "tag" },
      { id: "mobile", title: "Mobile tickets", description: "Keep your booking reference on your phone.", iconName: "phone" },
      { id: "support", title: "Help when you need it", description: "Our team can help before and during your trip.", iconName: "headset" },
    ],
  },
  routes: {
    title: "Popular train routes",
    items: [
      route("london-paris", "London", "Paris", "About 2h 30m", 49, "photo-1502602898657-3e91760cbb34"),
      route("rome-milan", "Rome", "Milan", "About 3h", 35, "photo-1552832230-c0197dd311b5"),
      route("tokyo-kyoto", "Tokyo", "Kyoto", "About 2h 15m", 88, "photo-1540959733332-eab4deabeeaf"),
      route("lisbon-porto", "Lisbon", "Porto", "About 3h", 22, "photo-1585208798174-6cedd86e019a"),
      route("nairobi-mombasa", "Nairobi", "Mombasa", "About 6h", 15, "photo-1516426122078-c23e76319801"),
      route("cape-town-johannesburg", "Cape Town", "Johannesburg", "About 27h", 45, "photo-1580060839134-75a5edca2e99"),
    ],
  },
  faqs: {
    title: "Train travel questions",
    items: [
      { id: "ticket", question: "How do I get my ticket?", answer: "Your booking confirmation includes your reference. Check the rules for your operator, as some journeys need a printed or station-collected ticket." },
      { id: "early", question: "How early should I arrive?", answer: "Around 20 minutes is usually enough, but allow more time for international trains with passport checks." },
      { id: "bags", question: "How much luggage can I bring?", answer: "Most trains are generous with luggage, but limits vary by operator. Check before you travel." },
      { id: "change", question: "Can I change my ticket?", answer: "Refundable tickets can usually be changed or cancelled before departure. Other tickets follow the operator's rules." },
      { id: "children", question: "Do children need a ticket?", answer: "Rules vary by country and operator. Children aged 2 to 15 pay a child fare on this site." },
    ],
  },
};

export default trainsContent;
