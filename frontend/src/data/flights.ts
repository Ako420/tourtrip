import type { FlightsContent } from "@/types";
import appPromo from "./appPromo";
import unsplashImage from "./unsplashImage";

const flightLinks = (cities: string[]) => {
  return cities.map((city) => ({
    label: `Flights to ${city}`,
    href: `/flights?to=${encodeURIComponent(city)}#deals`,
  }));
};

// Same shape as GET /flights/content. Used until API_URL is set. App stats are sample values.
const flightsContent: FlightsContent = {
  hero: {
    title: "Find your next flight",
    subtitle: "Compare fares and take off for less",
    imageUrl: unsplashImage("photo-1500835556837-99ac94a94552", 2000),
  },
  quickLinks: [
    { label: "My bookings", href: "/bookings", iconName: "ticket" },
    { label: "Deals", href: "/deals", iconName: "tag" },
    { label: "Customer support", href: "/support", iconName: "headset" },
    { label: "Explore destinations", href: "/inspiration", iconName: "globe" },
  ],
  trust: {
    title: "Fly with confidence",
    moreLabel: "Register now",
    moreHref: "/signup",
    items: [
      { id: "travelers", title: "Made for travelers", description: "Search, compare and book every part of your trip in one place.", iconName: "thumbs-up" },
      { id: "support", title: "Support around the clock", description: "Our team is ready to help before, during and after your trip.", iconName: "headset" },
      { id: "pricing", title: "Transparent pricing", description: "No surprises. Taxes and fees are included in the price you see.", iconName: "tag" },
      { id: "rewards", title: "Earn on every trip", description: "Collect rewards each time you book and use them on your next journey.", iconName: "coins" },
    ],
  },
  trending: {
    title: "See what's trending now",
    caption: "Great journeys start at the gate",
    imageUrl: unsplashImage("photo-1530521954074-e64f6810b32d", 1200),
    mapImageUrl: unsplashImage("photo-1499591934245-40b55745b905", 700),
    ctaLabel: "Explore the world",
    ctaHref: "/inspiration",
  },
  dealsTitle: "Popular flight deals",
  app: appPromo,
  banners: {
    title: "Discover what's happening",
    items: [
      { id: "winter", eyebrow: "Limited time", title: "Winter fare sale", subtitle: "Save on selected routes this month", href: "/flights#deals", ctaLabel: "Book now", imageUrl: unsplashImage("photo-1529074963764-98f45c47344b", 800), theme: "primary" },
      { id: "egypt", eyebrow: "Stay inspired", title: "Wonders of Egypt", subtitle: "History on a grand scale", href: "/inspiration/cairo", ctaLabel: "Read guide", imageUrl: unsplashImage("photo-1553913861-c0fddf2619ee", 800), theme: "sunset" },
      { id: "japan", eyebrow: "City breaks", title: "Tokyo after dark", subtitle: "Neon nights and great food", href: "/flights?to=Tokyo#deals", ctaLabel: "Book now", imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 800), theme: "sunset" },
      { id: "greece", eyebrow: "Sun seekers", title: "Island hop in Greece", subtitle: "White walls and blue seas", href: "/inspiration/santorini", ctaLabel: "Read guide", imageUrl: unsplashImage("photo-1570077188670-e3a8d69ac5ff", 800), theme: "sunset" },
    ],
  },
  why: {
    title: "Why book flights with Hotel Jr",
    heading: "Trips that suit you",
    body: "Booking a flight should be the exciting part of a trip, not the stressful one. With so much to compare, finding the right fare can take hours. Hotel Jr brings it together so you can search routes, compare prices and dates, and see the full cost before you book. Add a hotel to the same trip, keep your plans in one place, and spend your time looking forward to the journey instead.",
  },
  tips: {
    title: "How to book cheap flights",
    items: [
      { id: "midweek", question: "Fly during the working week", answer: "Tuesdays and Wednesdays are often cheaper than weekends, when demand from leisure travelers is highest." },
      { id: "early", question: "Book early", answer: "Fares tend to rise as seats fill up, so booking a few weeks ahead usually beats waiting until the last minute." },
      { id: "times", question: "Consider less popular departure times", answer: "Early morning and late evening flights are often priced lower than those in the middle of the day." },
      { id: "connection", question: "Choose flights with a connection", answer: "A stopover can cost less than a nonstop flight. Check that the layover is long enough to make your connection." },
      { id: "flexible", question: "Stay flexible with your dates", answer: "Moving your trip by a day or two can change the fare, so compare nearby dates before you book." },
      { id: "package", question: "Book a flight and hotel together", answer: "Package deals can cost less than booking each one separately, especially for longer stays." },
      { id: "fees", question: "Watch out for hidden costs", answer: "Check what is included in the fare, such as baggage and seat selection, so you can compare the real price." },
    ],
  },
  recommendations: {
    title: "Recommended by Hotel Jr",
    items: [
      { id: "destinations", label: "Flights to popular destinations", links: flightLinks(["Bangkok", "Dubai", "Hong Kong", "Johannesburg", "London", "Miami", "Nairobi", "New York", "Paris", "Tokyo"]) },
      { id: "routes", label: "Popular routes", links: [
        { label: "New York to London", href: "/flights?from=New%20York&to=London#deals" },
        { label: "Lagos to London", href: "/flights?from=Lagos&to=London#deals" },
        { label: "Nairobi to Dubai", href: "/flights?from=Nairobi&to=Dubai#deals" },
        { label: "Hong Kong to Tokyo", href: "/flights?from=Hong%20Kong&to=Tokyo#deals" },
        { label: "Accra to Paris", href: "/flights?from=Accra&to=Paris#deals" },
      ] },
    ],
  },
};

export default flightsContent;
