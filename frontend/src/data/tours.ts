import { tourPaths } from "@/constants";
import type { TourDay, TourDeparture, TourDetails, TourPlace, ToursContent, TourType } from "@/types";
import unsplashImage from "./unsplashImage";

type TourInput = {
  slug: string;
  type: TourType;
  name: string;
  city: string;
  country: string;
  summary: string;
  photoId: string;
  rating: number;
  reviewCount: number;
  price: number;
  firstDeparture?: string;
  itinerary: [title: string, description: string][];
};

const DEPARTURE_GAP_DAYS = 14;
const DEPARTURE_SEATS = [12, 7, 3, 9];
const DEPARTURE_EXTRA_PRICE = [0, 20, 0, 40];

const rows: TourInput[] = [
  {
    slug: "tokyo-highlights-private",
    type: "private",
    name: "Tokyo highlights with your own guide",
    city: "Tokyo",
    country: "Japan",
    summary: "See the city's best-known neighbourhoods at your own pace, with a private guide and car.",
    photoId: "photo-1540959733332-eab4deabeeaf",
    rating: 4.9,
    reviewCount: 412,
    price: 320,
    itinerary: [
      ["Temples and old streets", "Start in Asakusa, then visit Ueno and the historic streets nearby."],
      ["Modern Tokyo", "Explore Shibuya and Shinjuku, with time for food and shopping."],
    ],
  },
  {
    slug: "great-wall-private",
    type: "private",
    name: "The Great Wall and Beijing's old lanes",
    city: "Beijing",
    country: "China",
    summary: "Walk a quieter section of the wall, then explore the city's traditional hutongs.",
    photoId: "photo-1508804185872-d7badad00f7d",
    rating: 4.8,
    reviewCount: 356,
    price: 240,
    itinerary: [
      ["The Great Wall", "Leave early for the wall, with time to walk and enjoy the views."],
      ["Old Beijing", "Wander the hutongs with your guide and stop for a local lunch."],
    ],
  },
  {
    slug: "bali-culture-private",
    type: "private",
    name: "Bali temples and rice terraces",
    city: "Bali",
    country: "Indonesia",
    summary: "A relaxed trip through green hills, craft villages and lakeside temples.",
    photoId: "photo-1537996194471-e657df975ab4",
    rating: 4.7,
    reviewCount: 288,
    price: 280,
    itinerary: [
      ["Ubud", "Visit rice terraces and craft villages around Ubud."],
      ["The lakes", "Head into the cool hills for a lakeside temple."],
      ["The coast", "Finish with a slow day by the sea."],
    ],
  },
  {
    slug: "marrakech-private",
    type: "private",
    name: "Marrakech souks and gardens",
    city: "Marrakech",
    country: "Morocco",
    summary: "Find your way through the medina with a local guide, then slow down in its gardens.",
    photoId: "photo-1597212618440-806262de4f6b",
    rating: 4.6,
    reviewCount: 197,
    price: 260,
    itinerary: [
      ["The medina", "Explore the souks and the main square with your guide."],
      ["Palaces and gardens", "Visit historic palaces and a peaceful garden."],
      ["Your choice", "Spend your last day however you like, with your driver on hand."],
    ],
  },
  {
    slug: "cape-town-private",
    type: "private",
    name: "Cape Town, the peninsula and the winelands",
    city: "Cape Town",
    country: "South Africa",
    summary: "Mountains, penguins and vineyards in one flexible trip with your own driver-guide.",
    photoId: "photo-1580060839134-75a5edca2e99",
    rating: 4.8,
    reviewCount: 241,
    price: 410,
    itinerary: [
      ["Table Mountain", "Go up the mountain on a clear day and explore the city."],
      ["The peninsula", "Drive the coast and stop at Boulders Beach."],
      ["The winelands", "Spend the day among historic towns and vineyards."],
      ["Your choice", "Add a last stop before your trip home."],
    ],
  },
  {
    slug: "rome-private",
    type: "private",
    name: "Ancient Rome with a private guide",
    city: "Rome",
    country: "Italy",
    summary: "Skip the guesswork with a guide for the Colosseum, the Forum and the city's old streets.",
    photoId: "photo-1552832230-c0197dd311b5",
    rating: 4.9,
    reviewCount: 523,
    price: 290,
    itinerary: [
      ["Ancient Rome", "Visit the Colosseum, the Forum and the Palatine Hill."],
      ["Fountains and piazzas", "Walk through the historic centre, ending in Trastevere."],
    ],
  },
  {
    slug: "kenya-safari-group",
    type: "group",
    name: "Kenya safari from Nairobi",
    city: "Nairobi",
    country: "Kenya",
    summary: "Share game drives and sundowners with fellow travelers on this classic safari.",
    photoId: "photo-1516426122078-c23e76319801",
    rating: 4.8,
    reviewCount: 318,
    price: 890,
    firstDeparture: "2026-12-05",
    itinerary: [
      ["Nairobi", "Meet your group and visit Nairobi National Park."],
      ["Into the wild", "Travel to the safari camp and take your first game drive."],
      ["Game drives", "Spend a full day looking for wildlife with your guide."],
      ["Back to Nairobi", "One last morning drive before heading back."],
    ],
  },
  {
    slug: "egypt-classics-group",
    type: "group",
    name: "Egypt classics: Cairo and the pyramids",
    city: "Cairo",
    country: "Egypt",
    summary: "Discover the pyramids, old Cairo and its great bazaar with a small group.",
    photoId: "photo-1553913861-c0fddf2619ee",
    rating: 4.7,
    reviewCount: 402,
    price: 760,
    firstDeparture: "2026-12-12",
    itinerary: [
      ["Arrive in Cairo", "Meet your group and your guide."],
      ["The pyramids", "Spend the morning at Giza and see the Sphinx."],
      ["Old Cairo", "Explore historic mosques, churches and streets."],
      ["The bazaar", "Visit the great bazaar and enjoy a free afternoon."],
      ["Farewell", "Say goodbye to the group after breakfast."],
    ],
  },
  {
    slug: "japan-discovery-group",
    type: "group",
    name: "Japan discovery from Tokyo",
    city: "Tokyo",
    country: "Japan",
    summary: "A first taste of Japan, with city days, local food and easy company.",
    photoId: "photo-1540959733332-eab4deabeeaf",
    rating: 4.9,
    reviewCount: 287,
    price: 1120,
    firstDeparture: "2027-01-09",
    itinerary: [
      ["Welcome to Tokyo", "Meet your group for a welcome dinner."],
      ["Old Tokyo", "See temples and traditional streets in Asakusa."],
      ["Modern Tokyo", "Explore Shibuya and Shinjuku with your guide."],
      ["Day trip", "Leave the city for a day in the countryside."],
      ["Farewell", "Enjoy a free morning before you leave."],
    ],
  },
  {
    slug: "santorini-island-group",
    type: "group",
    name: "Santorini island days",
    city: "Santorini",
    country: "Greece",
    summary: "White villages, volcanic beaches and shared sunsets on a small group break.",
    photoId: "photo-1570077188670-e3a8d69ac5ff",
    rating: 4.6,
    reviewCount: 176,
    price: 690,
    firstDeparture: "2027-03-06",
    itinerary: [
      ["Arrive in Fira", "Meet your group and settle in."],
      ["Oia", "Walk the cliff path and watch the sunset."],
      ["Beaches", "Spend the day on the island's dark sand beaches."],
      ["Farewell", "Say goodbye over a final breakfast."],
    ],
  },
  {
    slug: "cappadocia-group",
    type: "group",
    name: "Cappadocia valleys and balloons",
    city: "Cappadocia",
    country: "Turkey",
    summary: "Walk the rock valleys and see the balloons rise with a like-minded group.",
    photoId: "photo-1641128324972-af3212f0f6bd",
    rating: 4.8,
    reviewCount: 263,
    price: 520,
    firstDeparture: "2026-12-19",
    itinerary: [
      ["Arrive", "Meet your group and see the valleys at sunset."],
      ["Valleys", "Walk among the rock pillars and visit an underground city."],
      ["Sunrise", "Watch the balloons at sunrise before you leave."],
    ],
  },
  {
    slug: "northern-lights-group",
    type: "group",
    name: "Northern lights from Tromso",
    city: "Tromso",
    country: "Norway",
    summary: "Join night trips out of town to look for the aurora. Sightings are never guaranteed.",
    photoId: "photo-1531366936337-7c912a4589a7",
    rating: 4.7,
    reviewCount: 214,
    price: 980,
    firstDeparture: "2027-01-16",
    itinerary: [
      ["Arrive in Tromso", "Meet your group and take your first night out."],
      ["Into the Arctic", "Explore the area by day and look for the lights at night."],
      ["Fjords", "Take a day trip through the fjords."],
      ["Farewell", "Say goodbye after breakfast."],
    ],
  },
];

const toDays = (itinerary: TourInput["itinerary"]): TourDay[] => {
  return itinerary.map(([title, description]) => ({ title, description }));
};

const toDepartures = (slug: string, price: number, firstDeparture?: string): TourDeparture[] => {
  if (!firstDeparture) return [];

  const firstTime = Date.parse(`${firstDeparture}T00:00:00Z`);

  return DEPARTURE_SEATS.map((seatsLeft, index) => ({
    id: `${slug}-${index + 1}`,
    date: new Date(firstTime + index * DEPARTURE_GAP_DAYS * 86_400_000).toISOString().slice(0, 10),
    seatsLeft,
    price: price + DEPARTURE_EXTRA_PRICE[index],
  }));
};

const includedByType: Record<TourType, string[]> = {
  private: ["Your own guide", "Private car and driver", "Hotel pick-up and drop-off", "Accommodation"],
  group: ["A tour leader", "Shared transport", "Accommodation", "Entry to the sights listed"],
};

const notIncluded = ["Flights", "Travel insurance", "Personal spending"];

// Same shape as GET /tours and GET /tours/:slug. Used until API_URL is set. Ratings and prices are made up.
export const tours: TourDetails[] = rows.map(({ photoId, firstDeparture, itinerary, ...tour }, index) => ({
  ...tour,
  id: String(index + 1),
  imageUrl: unsplashImage(photoId, 1200),
  days: itinerary.length,
  currency: "USD",
  itinerary: toDays(itinerary),
  included: includedByType[tour.type],
  notIncluded,
  departures: toDepartures(tour.slug, tour.price, firstDeparture),
}));

const place = (path: string, name: string, photoId: string): TourPlace => {
  return { id: name.toLowerCase().replaceAll(" ", "-"), name, imageUrl: unsplashImage(photoId, 500), href: `${path}?q=${encodeURIComponent(name)}` };
};

const placeLinks = (path: string, label: string, places: string[]) => {
  return places.map((name) => ({ label: `${label} in ${name}`, href: `${path}?q=${encodeURIComponent(name)}` }));
};

const recommendations: ToursContent["recommendations"] = {
  title: "Hotel Jr recommended",
  items: [
    {
      id: "cities",
      label: "Popular cities",
      links: [
        ...placeLinks(tourPaths.private, "Private tours", ["Tokyo", "Beijing", "Bali", "Marrakech", "Cape Town", "Rome"]),
        ...placeLinks(tourPaths.group, "Group tours", ["Nairobi", "Cairo", "Tokyo", "Santorini", "Cappadocia", "Tromso"]),
      ],
    },
    {
      id: "countries",
      label: "Popular countries",
      links: [
        ...placeLinks(tourPaths.private, "Private tours", ["Japan", "China", "Indonesia", "Morocco", "South Africa", "Italy"]),
        ...placeLinks(tourPaths.group, "Group tours", ["Kenya", "Egypt", "Japan", "Greece", "Turkey", "Norway"]),
      ],
    },
  ],
};

// Same shape as GET /tours/content. Used until API_URL is set.
export const toursContent: Record<TourType, ToursContent> = {
  private: {
    title: "Private Tours",
    subtitle: "Your own guide and car, on the dates you choose.",
    imageUrl: unsplashImage("photo-1476514525535-07fb3b4ae5f1", 2000),
    popular: ["Tokyo", "Bali", "Rome", "Cape Town", "Marrakech", "Beijing"],
    customize: { label: "Customize my trip", href: "/planner" },
    recommended: {
      title: "Recommended destinations",
      tabs: [
        { id: "all", label: "All", cities: ["Tokyo", "Beijing", "Bali", "Marrakech", "Cape Town", "Rome"] },
        { id: "asia", label: "Asia", cities: ["Tokyo", "Beijing", "Bali"] },
        { id: "africa", label: "Africa", cities: ["Marrakech", "Cape Town"] },
        { id: "europe", label: "Europe", cities: ["Rome"] },
      ],
    },
    cities: {
      title: "Popular cities",
      items: [
        place(tourPaths.private, "Tokyo", "photo-1540959733332-eab4deabeeaf"),
        place(tourPaths.private, "Beijing", "photo-1508804185872-d7badad00f7d"),
        place(tourPaths.private, "Bali", "photo-1537996194471-e657df975ab4"),
        place(tourPaths.private, "Marrakech", "photo-1597212618440-806262de4f6b"),
        place(tourPaths.private, "Cape Town", "photo-1580060839134-75a5edca2e99"),
        place(tourPaths.private, "Rome", "photo-1552832230-c0197dd311b5"),
      ],
    },
    countries: {
      title: "Popular global destinations",
      items: [
        place(tourPaths.group, "Kenya", "photo-1516426122078-c23e76319801"),
        place(tourPaths.group, "Egypt", "photo-1553913861-c0fddf2619ee"),
        place(tourPaths.group, "Greece", "photo-1570077188670-e3a8d69ac5ff"),
        place(tourPaths.group, "Turkey", "photo-1641128324972-af3212f0f6bd"),
        place(tourPaths.group, "Norway", "photo-1531366936337-7c912a4589a7"),
      ],
    },
    recommendations,
  },
  group: {
    title: "Group Tours",
    subtitle: "Set departures, shared with fellow travelers.",
    imageUrl: unsplashImage("photo-1516426122078-c23e76319801", 2000),
    popular: ["Nairobi", "Cairo", "Tokyo", "Santorini", "Cappadocia", "Tromso"],
    recommended: {
      title: "Recommended destinations",
      tabs: [
        { id: "all", label: "All", cities: ["Nairobi", "Cairo", "Tokyo", "Santorini", "Cappadocia", "Tromso"] },
        { id: "africa", label: "Africa", cities: ["Nairobi", "Cairo"] },
        { id: "asia", label: "Asia", cities: ["Tokyo", "Cappadocia"] },
        { id: "europe", label: "Europe", cities: ["Santorini", "Tromso"] },
      ],
    },
    cities: {
      title: "Popular cities",
      items: [
        place(tourPaths.group, "Nairobi", "photo-1516426122078-c23e76319801"),
        place(tourPaths.group, "Cairo", "photo-1553913861-c0fddf2619ee"),
        place(tourPaths.group, "Tokyo", "photo-1540959733332-eab4deabeeaf"),
        place(tourPaths.group, "Santorini", "photo-1570077188670-e3a8d69ac5ff"),
        place(tourPaths.group, "Cappadocia", "photo-1641128324972-af3212f0f6bd"),
        place(tourPaths.group, "Tromso", "photo-1531366936337-7c912a4589a7"),
      ],
    },
    countries: {
      title: "Popular global destinations",
      items: [
        place(tourPaths.private, "China", "photo-1508804185872-d7badad00f7d"),
        place(tourPaths.private, "Indonesia", "photo-1537996194471-e657df975ab4"),
        place(tourPaths.private, "Morocco", "photo-1597212618440-806262de4f6b"),
        place(tourPaths.private, "South Africa", "photo-1580060839134-75a5edca2e99"),
        place(tourPaths.private, "Italy", "photo-1552832230-c0197dd311b5"),
      ],
    },
    recommendations,
  },
};
