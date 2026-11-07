import { toTrainRouteHref } from "@/lib";
import type { LinkItem, TrainRouteGroup, TrainsContent, TrainTravelCard } from "@/types";
import { getTrainRouteFare, trainOperators } from "./trainOffers";
import unsplashImage from "./unsplashImage";

type Stops = [from: string, to: string];

const routeLink = ([from, to]: Stops): LinkItem => {
  return { label: `${from} to ${to}`, href: toTrainRouteHref(from, to) };
};

const fromLink = (label: string, from: string): LinkItem => {
  return { label, href: toTrainRouteHref(from) };
};

const toLink = (to: string): LinkItem => {
  return { label: to, href: `/trains?${new URLSearchParams({ to, tripType: "one-way" })}#search` };
};

const travelCard = (id: string, title: string, photoId: string, stops: Stops[], searches: LinkItem[]): TrainTravelCard => {
  return { id, title, imageUrl: unsplashImage(photoId, 600), links: stops.map(routeLink), searches };
};

const routeGroup = (id: string, title: string, photoId: string, stops: Stops[]): TrainRouteGroup => {
  return {
    id,
    title,
    imageUrl: unsplashImage(photoId, 800),
    routes: stops.map(([from, to]) => ({ from, to, fromPrice: getTrainRouteFare(from, to), currency: "USD" })),
  };
};

// Same shape as GET /trains/content. Used until API_URL is set. Operators and fares are sample values.
const trainsContent: TrainsContent = {
  hero: {
    title: "Train tickets",
    subtitle: "Compare routes and travel by rail",
    imageUrl: unsplashImage("photo-1532105956626-9569c03602f6", 2000),
  },
  benefits: [
    { id: "compare", title: "All in one search", description: "See times and fares side by side for your journey.", iconName: "search" },
    { id: "price", title: "Clear pricing", description: "See the full price for your group before you book.", iconName: "tag" },
    { id: "currency", title: "Prices in your currency", description: "Choose your currency from the top of the page.", iconName: "globe" },
    { id: "support", title: "Help with your trip", description: "Find answers or send a question from Customer support.", iconName: "headset" },
  ],
  sectionLinks: [
    { label: "Train operators", href: "#operators" },
    { label: "Europe", href: "#europe" },
    { label: "Asia", href: "#asia" },
    { label: "Africa", href: "#africa" },
    { label: "Train routes", href: "#routes-europe" },
    { label: "Book train tickets", href: "#how-to-book" },
    { label: "Travel guides", href: "#guides" },
  ],
  operators: {
    title: "Train operators",
    note: "Operators and fares are samples.",
    items: trainOperators.map((operator) => operator.name),
  },
  regions: [
    {
      id: "europe",
      title: "Train travel in Europe",
      items: [
        travelCard(
          "uk",
          "Trains in the UK",
          "photo-1486299267070-83823f5448dd",
          [["London", "Manchester"], ["London", "Edinburgh"], ["London", "York"], ["London", "Paris"]],
          [fromLink("Search UK trains", "London")],
        ),
        travelCard(
          "france",
          "Trains in France",
          "photo-1511739001486-6bfe10ce785f",
          [["Paris", "Lyon"], ["Paris", "Marseille"], ["Paris", "Bordeaux"], ["Paris", "Brussels"]],
          [fromLink("Search France trains", "Paris")],
        ),
        travelCard(
          "italy",
          "Trains in Italy",
          "photo-1552832230-c0197dd311b5",
          [["Rome", "Milan"], ["Rome", "Florence"], ["Milan", "Venice"], ["Rome", "Naples"]],
          [fromLink("Search Italy trains", "Rome")],
        ),
        travelCard(
          "spain",
          "Trains in Spain",
          "photo-1539037116277-4db20889f2d4",
          [["Madrid", "Barcelona"], ["Madrid", "Seville"], ["Madrid", "Valencia"], ["Barcelona", "Valencia"]],
          [fromLink("Search Spain trains", "Madrid")],
        ),
        travelCard(
          "more-europe",
          "More trains in Europe",
          "photo-1467269204594-9661b134dd2b",
          [["Berlin", "Munich"], ["Berlin", "Hamburg"], ["Lisbon", "Porto"], ["Amsterdam", "Brussels"]],
          [fromLink("Search Germany trains", "Berlin"), fromLink("Search Portugal trains", "Lisbon")],
        ),
      ],
    },
    {
      id: "asia",
      title: "Train travel in Asia",
      items: [
        travelCard(
          "china",
          "Trains in China",
          "photo-1508804185872-d7badad00f7d",
          [["Beijing", "Shanghai"], ["Beijing", "Xi'an"], ["Shanghai", "Guangzhou"], ["Guangzhou", "Hong Kong"]],
          [fromLink("Search China trains", "Beijing")],
        ),
        travelCard(
          "japan-korea",
          "Trains in Japan and South Korea",
          "photo-1540959733332-eab4deabeeaf",
          [["Tokyo", "Kyoto"], ["Tokyo", "Osaka"], ["Seoul", "Busan"], ["Seoul", "Gyeongju"]],
          [fromLink("Search Japan trains", "Tokyo"), fromLink("Search South Korea trains", "Seoul")],
        ),
      ],
    },
    {
      id: "africa",
      title: "Train travel in Africa",
      items: [
        travelCard(
          "nigeria",
          "Trains in Nigeria",
          "photo-1474487548417-781cb71495f3",
          [["Lagos", "Ibadan"], ["Abuja", "Kaduna"]],
          [fromLink("Search Nigeria trains", "Lagos")],
        ),
        travelCard(
          "kenya-south-africa",
          "Trains in Kenya and South Africa",
          "photo-1580060839134-75a5edca2e99",
          [["Nairobi", "Mombasa"], ["Johannesburg", "Cape Town"], ["Johannesburg", "Durban"]],
          [fromLink("Search Kenya trains", "Nairobi"), fromLink("Search South Africa trains", "Johannesburg")],
        ),
      ],
    },
  ],
  routeSections: [
    {
      id: "routes-europe",
      title: "Popular European train routes",
      items: [
        routeGroup("cross-border", "Top cross-border routes", "photo-1541427468627-a89a96e5ca1d", [
          ["London", "Paris"], ["Paris", "London"], ["London", "Brussels"], ["London", "Amsterdam"], ["Paris", "Amsterdam"], ["Brussels", "Amsterdam"],
        ]),
        routeGroup("uk-routes", "Top UK routes", "photo-1515165562839-978bbcf18277", [
          ["London", "Manchester"], ["Manchester", "London"], ["London", "Edinburgh"], ["Edinburgh", "London"], ["London", "York"], ["Manchester", "York"],
        ]),
        routeGroup("italy-routes", "Top Italy routes", "photo-1552832230-c0197dd311b5", [
          ["Rome", "Milan"], ["Milan", "Rome"], ["Rome", "Florence"], ["Florence", "Venice"], ["Milan", "Venice"], ["Rome", "Naples"],
        ]),
        routeGroup("spain-routes", "Top Spain routes", "photo-1583422409516-2895a77efded", [
          ["Madrid", "Barcelona"], ["Barcelona", "Madrid"], ["Madrid", "Seville"], ["Madrid", "Valencia"], ["Barcelona", "Valencia"], ["Barcelona", "Seville"],
        ]),
        routeGroup("france-routes", "Top France routes", "photo-1502602898657-3e91760cbb34", [
          ["Paris", "Lyon"], ["Lyon", "Paris"], ["Paris", "Marseille"], ["Marseille", "Paris"], ["Paris", "Bordeaux"], ["Lyon", "Marseille"],
        ]),
        routeGroup("germany-routes", "Top Germany routes", "photo-1560969184-10fe8719e047", [
          ["Berlin", "Munich"], ["Munich", "Berlin"], ["Berlin", "Hamburg"], ["Hamburg", "Berlin"], ["Frankfurt", "Berlin"], ["Frankfurt", "Munich"],
        ]),
      ],
    },
    {
      id: "routes-asia",
      title: "Popular Asian train routes",
      items: [
        routeGroup("china-routes", "Top China routes", "photo-1508804185872-d7badad00f7d", [
          ["Beijing", "Shanghai"], ["Shanghai", "Beijing"], ["Beijing", "Xi'an"], ["Beijing", "Guangzhou"], ["Shanghai", "Guangzhou"], ["Guangzhou", "Hong Kong"],
        ]),
        routeGroup("japan-routes", "Top Japan routes", "photo-1540959733332-eab4deabeeaf", [
          ["Tokyo", "Kyoto"], ["Kyoto", "Tokyo"], ["Tokyo", "Osaka"], ["Osaka", "Tokyo"], ["Osaka", "Kyoto"], ["Tokyo", "Hiroshima"],
        ]),
        routeGroup("korea-routes", "Top South Korea routes", "photo-1538485399081-7191377e8241", [
          ["Seoul", "Busan"], ["Busan", "Seoul"], ["Seoul", "Gyeongju"], ["Gyeongju", "Busan"], ["Seoul", "Daegu"], ["Daegu", "Seoul"],
        ]),
      ],
    },
    {
      id: "routes-africa",
      title: "Popular African train routes",
      items: [
        routeGroup("nigeria-routes", "Top Nigeria routes", "photo-1474487548417-781cb71495f3", [
          ["Lagos", "Ibadan"], ["Ibadan", "Lagos"], ["Abuja", "Kaduna"], ["Kaduna", "Abuja"],
        ]),
        routeGroup("kenya-routes", "Top Kenya routes", "photo-1516426122078-c23e76319801", [
          ["Nairobi", "Mombasa"], ["Mombasa", "Nairobi"],
        ]),
        routeGroup("south-africa-routes", "Top South Africa routes", "photo-1580060839134-75a5edca2e99", [
          ["Johannesburg", "Cape Town"], ["Cape Town", "Johannesburg"], ["Johannesburg", "Durban"], ["Durban", "Johannesburg"],
        ]),
      ],
    },
  ],
  steps: {
    title: "How to book train tickets on Hotel Jr",
    items: [
      { id: "journey", question: "1. Enter your journey", answer: "Choose where you are leaving from, where you are going, your dates and who is travelling." },
      { id: "compare", question: "2. Compare trains", answer: "Sort by price, speed or departure time, and filter by changes, operator or refundable fares." },
      { id: "choose", question: "3. Choose your train", answer: "Check the times, class and refund rules, then select the train that suits you." },
      { id: "details", question: "4. Fill in passenger details", answer: "Add the name of each passenger and the contact details for your booking." },
      { id: "review", question: "5. Review your price", answer: "See the full price for your group before you confirm." },
      { id: "reference", question: "6. Keep your reference", answer: "Your confirmation shows a booking reference. While the site runs on sample data this is a demo reference, and no ticket is issued." },
    ],
  },
  guides: {
    title: "Travel guides for your rail trip",
    moreLabel: "View more guides",
    moreHref: "/inspiration",
    tabs: [
      { id: "europe", label: "Europe", cities: ["Paris", "Rome", "The Alps", "Tromso"] },
      { id: "asia", label: "Asia", cities: ["Tokyo", "Bali", "Cappadocia"] },
      { id: "africa", label: "Africa", cities: ["Cape Town", "Nairobi", "Marrakech"] },
    ],
  },
  journeys: {
    title: "Popular train journeys",
    items: [
      {
        id: "europe",
        title: "Trains in Europe",
        links: [
          fromLink("Trains in the UK", "London"),
          fromLink("Trains in France", "Paris"),
          fromLink("Trains in Italy", "Rome"),
          fromLink("Trains in Spain", "Madrid"),
          fromLink("Trains in Germany", "Berlin"),
          fromLink("Trains in Portugal", "Lisbon"),
        ],
      },
      {
        id: "asia",
        title: "Trains in Asia",
        links: [fromLink("Trains in China", "Beijing"), fromLink("Trains in Japan", "Tokyo"), fromLink("Trains in South Korea", "Seoul")],
      },
      {
        id: "africa",
        title: "Trains in Africa",
        links: [
          fromLink("Trains in Nigeria", "Lagos"),
          fromLink("Trains in Kenya", "Nairobi"),
          fromLink("Trains in South Africa", "Johannesburg"),
        ],
      },
      {
        id: "departures",
        title: "Popular departure cities",
        links: ["London", "Paris", "Rome", "Milan", "Tokyo", "Lagos"].map((city) => fromLink(city, city)),
      },
      {
        id: "destinations",
        title: "Top destinations by train",
        links: ["Paris", "Barcelona", "Florence", "Kyoto", "Mombasa", "Cape Town"].map(toLink),
      },
      {
        id: "more",
        title: "More ways to travel",
        links: [
          { label: "Hotels", href: "/hotels" },
          { label: "Flights", href: "/flights" },
          { label: "Flight + Hotel", href: "/packages" },
          { label: "Cars", href: "/cars" },
          { label: "Attractions", href: "/attractions" },
          { label: "Cruises", href: "/cruises" },
        ],
      },
    ],
  },
};

export default trainsContent;
