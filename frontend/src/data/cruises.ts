import type { CruiseDetails, CruiseSailing, CruisesContent } from "@/types";
import unsplashImage from "./unsplashImage";

type CruiseInput = {
  slug: string;
  name: string;
  line: string;
  destination: string;
  summary: string;
  route: string[];
  nights: number;
  photoId: string;
  rating: number;
  reviewCount: number;
  price: number;
  firstSailing: string;
};

const SAILING_GAP_DAYS = 21;
const SAILING_EXTRA_PRICE = [0, 40, 0, 80];

const rows: CruiseInput[] = [
  {
    slug: "greek-islands",
    name: "Greek islands in a week",
    line: "Bluewater Voyages",
    destination: "Mediterranean",
    summary: "White villages and blue bays, with a new island to explore almost every day.",
    route: ["Athens", "Mykonos", "Santorini", "Rhodes", "Athens"],
    nights: 7,
    photoId: "photo-1570077188670-e3a8d69ac5ff",
    rating: 4.8,
    reviewCount: 642,
    price: 899,
    firstSailing: "2027-03-20",
  },
  {
    slug: "western-mediterranean",
    name: "Western Mediterranean classics",
    line: "Bluewater Voyages",
    destination: "Mediterranean",
    summary: "History, food and coastal cities between Rome and the south of Spain.",
    route: ["Rome", "Marseille", "Barcelona", "Valencia", "Rome"],
    nights: 7,
    photoId: "photo-1552832230-c0197dd311b5",
    rating: 4.6,
    reviewCount: 518,
    price: 829,
    firstSailing: "2027-02-13",
  },
  {
    slug: "bosphorus-to-athens",
    name: "Bosphorus to Athens",
    line: "Meridian Line",
    destination: "Mediterranean",
    summary: "Sail from Istanbul's skyline to the Greek capital on this short voyage.",
    route: ["Istanbul", "Kusadasi", "Mykonos", "Athens"],
    nights: 5,
    photoId: "photo-1524231757912-21f4fe3a7200",
    rating: 4.5,
    reviewCount: 287,
    price: 640,
    firstSailing: "2027-01-23",
  },
  {
    slug: "arabian-gulf",
    name: "Arabian Gulf getaway",
    line: "Meridian Line",
    destination: "Arabian Gulf",
    summary: "Modern skylines and desert coast on a warm winter break.",
    route: ["Dubai", "Abu Dhabi", "Doha", "Dubai"],
    nights: 4,
    photoId: "photo-1512453979798-5ea266f8880c",
    rating: 4.4,
    reviewCount: 356,
    price: 460,
    firstSailing: "2026-11-28",
  },
  {
    slug: "straits-of-malacca",
    name: "Straits of Malacca escape",
    line: "Silk Route Cruises",
    destination: "Southeast Asia",
    summary: "A short tropical trip from Singapore with island stops along the way.",
    route: ["Singapore", "Penang", "Phuket", "Singapore"],
    nights: 4,
    photoId: "photo-1525625293386-3f8f99389edd",
    rating: 4.6,
    reviewCount: 731,
    price: 390,
    firstSailing: "2026-12-05",
  },
  {
    slug: "hong-kong-to-tokyo",
    name: "Hong Kong to Tokyo",
    line: "Silk Route Cruises",
    destination: "East Asia",
    summary: "Connect two great cities by sea, with time ashore in between.",
    route: ["Hong Kong", "Okinawa", "Kagoshima", "Tokyo"],
    nights: 8,
    photoId: "photo-1536599018102-9f803c140fc1",
    rating: 4.7,
    reviewCount: 244,
    price: 1190,
    firstSailing: "2027-03-06",
  },
  {
    slug: "norwegian-coast",
    name: "Norwegian coast and Tromso",
    line: "Polar Star Line",
    destination: "Norway",
    summary: "Sail north past fjords and mountains to the edge of the Arctic.",
    route: ["Bergen", "Alesund", "Trondheim", "Tromso"],
    nights: 6,
    photoId: "photo-1531366936337-7c912a4589a7",
    rating: 4.9,
    reviewCount: 409,
    price: 1340,
    firstSailing: "2027-01-09",
  },
  {
    slug: "australia-south-coast",
    name: "Australia's south coast",
    line: "Southern Cross Line",
    destination: "Australia",
    summary: "Leave from Sydney Harbour for Melbourne and the wild shores of Tasmania.",
    route: ["Sydney", "Melbourne", "Hobart", "Sydney"],
    nights: 7,
    photoId: "photo-1506973035872-a4ec16b8e8d9",
    rating: 4.7,
    reviewCount: 328,
    price: 1050,
    firstSailing: "2026-12-12",
  },
];

const toSailings = (cruise: Pick<CruiseInput, "slug" | "route" | "nights" | "price">, firstSailing: string): CruiseSailing[] => {
  const { slug, route, nights, price } = cruise;
  const firstTime = Date.parse(`${firstSailing}T00:00:00Z`);

  return SAILING_EXTRA_PRICE.map((extraPrice, index) => ({
    id: `${slug}-${index + 1}`,
    date: new Date(firstTime + index * SAILING_GAP_DAYS * 86_400_000).toISOString().slice(0, 10),
    port: route[0],
    nights,
    price: price + extraPrice,
  }));
};

const included = ["Your cabin", "Meals in the main restaurants", "Onboard entertainment"];
const notIncluded = ["Flights", "Shore excursions", "Drinks and tips", "Travel insurance"];

// Fictional lines with the same shape as GET /cruises and GET /cruises/:slug. Used until API_URL is set.
export const cruises: CruiseDetails[] = rows.map(({ photoId, firstSailing, ...cruise }, index) => ({
  ...cruise,
  id: String(index + 1),
  imageUrl: unsplashImage(photoId, 1200),
  currency: "USD",
  sailings: toSailings(cruise, firstSailing),
  included,
  notIncluded,
}));

// Same shape as GET /cruises/content. Used until API_URL is set.
export const cruisesContent: CruisesContent = {
  title: "Cruises",
  subtitle: "See more of the world, and unpack only once.",
  imageUrl: unsplashImage("photo-1570077188670-e3a8d69ac5ff", 2000),
};
