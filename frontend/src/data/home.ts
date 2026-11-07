import type { HomeContent, LinkItem } from "@/types";
import appPromo from "./appPromo";
import unsplashImage from "./unsplashImage";

const toLinks = (labels: string[], getHref: (label: string) => string): LinkItem[] => {
  return labels.map((label) => ({ label, href: getHref(label) }));
};

const hotelLinks = (cities: string[]) => {
  return toLinks(cities, (city) => `/hotels/list?destination=${encodeURIComponent(city)}`).map((link) => ({
    ...link,
    label: `Hotels in ${link.label}`,
  }));
};

// Same shape as GET /home. Used until API_URL is set. Ratings and review counts are sample values.
const homeContent: HomeContent = {
  hero: {
    title: "Your next stay starts here",
    imageUrl: unsplashImage("photo-1542314831-068cd1dbfeeb", 2000),
    guarantees: [
      { id: "price", label: "Clear pricing", iconName: "tag" },
      { id: "compare", label: "Hotels, flights and more", iconName: "compass" },
      { id: "planner", label: "Free trip planner", iconName: "route" },
    ],
  },
  promotions: {
    title: "Welcome offers",
    intro: {
      title: "Join today and save more on every trip",
      ctaLabel: "Sign in & claim all",
      ctaHref: "/login",
    },
    items: [
      {
        id: "hotels-10",
        title: "10% off",
        subtitle: "Hotels & Homes",
        terms: "First hotel booking only. Minimum spend applies.",
        iconName: "bed",
        ctaLabel: "Claim",
        ctaHref: "/login",
      },
      {
        id: "trains-5",
        title: "5% off",
        subtitle: "Train tickets",
        terms: "Selected routes only.",
        iconName: "train",
        ctaLabel: "Claim",
        ctaHref: "/login",
      },
      {
        id: "tours-10",
        title: "10% off",
        subtitle: "Attractions & Tours",
        terms: "Valid on tickets over $30.",
        iconName: "ticket",
        ctaLabel: "Claim",
        ctaHref: "/login",
      },
      {
        id: "cars-8",
        title: "8% off",
        subtitle: "Car rentals",
        terms: "Rentals of three days or more.",
        iconName: "car",
        ctaLabel: "Claim",
        ctaHref: "/login",
      },
      {
        id: "flights-5",
        title: "$15 off",
        subtitle: "Flights",
        terms: "First flight booking only.",
        iconName: "plane",
        ctaLabel: "Claim",
        ctaHref: "/login",
      },
    ],
  },
  banners: [
    {
      id: "winter-sun",
      eyebrow: "Limited time",
      title: "Winter sun escapes",
      subtitle: "Up to 18% off warm beach and city stays",
      href: "/deals/winter-sun",
      ctaLabel: "See deals",
      imageUrl: unsplashImage("photo-1436491865332-7a61a109cc05", 1400),
      theme: "primary",
    },
    {
      id: "coast",
      eyebrow: "Stay inspired",
      title: "Escape to the coast",
      subtitle: "Quiet beaches and slow mornings",
      href: "/hotels/list?destination=Bali",
      ctaLabel: "See stays",
      imageUrl: unsplashImage("photo-1507525428034-b723cf961d3e", 900),
      theme: "sunset",
    },
  ],
  inspiration: {
    title: "Get inspired for your next trip",
    items: [
      { id: "anywhere", name: "Anywhere", imageUrl: unsplashImage("photo-1451187580459-43490279c0fa", 500), href: "/hotels/list" },
      { id: "bali", name: "Bali", imageUrl: unsplashImage("photo-1537996194471-e657df975ab4", 500), href: "/hotels/list?destination=Bali" },
      { id: "tokyo", name: "Tokyo", imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 500), href: "/hotels/list?destination=Tokyo" },
      { id: "paris", name: "Paris", imageUrl: unsplashImage("photo-1511739001486-6bfe10ce785f", 500), href: "/hotels/list?destination=Paris" },
      { id: "rome", name: "Rome", imageUrl: unsplashImage("photo-1552832230-c0197dd311b5", 500), href: "/hotels/list?destination=Rome" },
      { id: "dubai", name: "Dubai", imageUrl: unsplashImage("photo-1512453979798-5ea266f8880c", 500), href: "/hotels/list?destination=Dubai" },
      { id: "cape-town", name: "Cape Town", imageUrl: unsplashImage("photo-1580060839134-75a5edca2e99", 500), href: "/hotels/list?destination=Cape%20Town" },
      { id: "marrakech", name: "Marrakech", imageUrl: unsplashImage("photo-1597212618440-806262de4f6b", 500), href: "/hotels/list?destination=Marrakech" },
      { id: "singapore", name: "Singapore", imageUrl: unsplashImage("photo-1525625293386-3f8f99389edd", 500), href: "/hotels/list?destination=Singapore" },
      { id: "nairobi", name: "Nairobi", imageUrl: unsplashImage("photo-1516426122078-c23e76319801", 500), href: "/hotels/list?destination=Nairobi" },
    ],
  },
  places: {
    title: "Places you may like",
    moreHref: "/attractions",
    items: [
      { id: "colosseum", name: "The Colosseum", city: "Rome", badge: "Top pick", imageUrl: unsplashImage("photo-1552832230-c0197dd311b5"), rating: 4.8, reviewCount: 3685, href: "/attractions?q=Rome#results" },
      { id: "taj-mahal", name: "Taj Mahal", city: "Agra", badge: "Top pick", imageUrl: unsplashImage("photo-1564507592333-c60657eea523"), rating: 4.9, reviewCount: 20441, href: "/attractions?q=Agra#results" },
      { id: "machu-picchu", name: "Machu Picchu", city: "Cusco", badge: "Top pick", imageUrl: unsplashImage("photo-1526392060635-9d6019884377"), rating: 4.9, reviewCount: 8120, href: "/attractions?q=Cusco#results" },
      { id: "big-ben", name: "Big Ben", city: "London", badge: "Top pick", imageUrl: unsplashImage("photo-1529655683826-aba9b3e77383"), rating: 4.6, reviewCount: 5179, href: "/attractions?q=London#results" },
      { id: "eiffel-tower", name: "Eiffel Tower", city: "Paris", badge: "Top pick", imageUrl: unsplashImage("photo-1511739001486-6bfe10ce785f"), rating: 4.7, reviewCount: 12490, href: "/attractions?q=Paris#results" },
      { id: "great-wall", name: "The Great Wall", city: "Beijing", badge: "Top pick", imageUrl: unsplashImage("photo-1508804185872-d7badad00f7d"), rating: 4.8, reviewCount: 9310, href: "/attractions?q=Beijing#results" },
    ],
  },
  moments: {
    title: "Magical trip moments that last",
    moreHref: "/inspiration",
    items: [
      { id: "balloons", title: "Sunrise over Cappadocia by hot air balloon", location: "Cappadocia", imageUrl: unsplashImage("photo-1641128324972-af3212f0f6bd"), href: "/inspiration/cappadocia" },
      { id: "temple", title: "A quiet morning at a lakeside temple", location: "Bali", imageUrl: unsplashImage("photo-1537996194471-e657df975ab4"), href: "/inspiration/bali" },
      { id: "safari", title: "Golden hour on a savanna safari", location: "East Africa", imageUrl: unsplashImage("photo-1516426122078-c23e76319801"), href: "/inspiration/nairobi" },
      { id: "aurora", title: "Chasing the northern lights", location: "Arctic Circle", imageUrl: unsplashImage("photo-1531366936337-7c912a4589a7"), href: "/inspiration/tromso" },
      { id: "lake", title: "Rowing across a mountain lake", location: "The Alps", imageUrl: unsplashImage("photo-1476514525535-07fb3b4ae5f1"), href: "/inspiration/the-alps" },
    ],
  },
  handpickedHotels: {
    title: "Stay cozy at our handpicked hotels",
    moreHref: "/hotels/list",
  },
  app: appPromo,
  recommendations: {
    title: "Hotel Jr recommendations",
    items: [
      {
        id: "hotels",
        label: "Featured hotel destinations",
        links: hotelLinks([
          "Bali", "Lisbon", "Tokyo", "Nairobi", "Marrakech", "Phuket", "Cape Town", "Dubai",
          "Singapore", "Hong Kong", "Istanbul", "Paris", "London", "Rome", "New York",
        ]),
      },
      {
        id: "flights",
        label: "Featured flight destinations",
        links: toLinks(
          ["Flights to Tokyo", "Flights to Dubai", "Flights to Paris", "Flights to London", "Flights to Nairobi", "Flights to Bali", "Flights to Rome", "Flights to New York", "Flights to Singapore", "Flights to Istanbul"],
          () => "/flights",
        ),
      },
      {
        id: "guides",
        label: "Featured guides",
        links: toLinks(
          ["Tokyo travel guide", "Bali travel guide", "Paris travel guide", "Rome travel guide", "Marrakech travel guide", "Cape Town travel guide"],
          (label) => `/inspiration/${label.replace(" travel guide", "").toLowerCase().replace(" ", "-")}`,
        ),
      },
      {
        id: "attractions",
        label: "Popular attractions",
        links: toLinks(
          ["The Colosseum", "Taj Mahal", "Machu Picchu", "Big Ben", "Eiffel Tower", "The Great Wall"],
          () => "/attractions",
        ),
      },
      {
        id: "cars",
        label: "Car rentals in top cities",
        links: toLinks(
          ["Car rentals in Dubai", "Car rentals in Lisbon", "Car rentals in Cape Town", "Car rentals in Rome", "Car rentals in Bali"],
          () => "/cars",
        ),
      },
    ],
  },
};

export default homeContent;
