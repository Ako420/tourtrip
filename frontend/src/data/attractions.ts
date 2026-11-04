import type { Attraction } from "@/types";
import unsplashImage from "./unsplashImage";

type AttractionInput = [
  slug: string,
  name: string,
  city: string,
  country: string,
  category: Attraction["category"],
  photoId: string,
  rating: number,
  reviewCount: number,
  duration: string,
  price: number,
  freeCancellation: boolean,
];

const rows: AttractionInput[] = [
  ["colosseum", "The Colosseum", "Rome", "Italy", "landmarks", "photo-1552832230-c0197dd311b5", 4.8, 3685, "2 hours", 32, true],
  ["taj-mahal", "Taj Mahal", "Agra", "India", "landmarks", "photo-1564507592333-c60657eea523", 4.9, 20441, "3 hours", 25, true],
  ["machu-picchu", "Machu Picchu", "Cusco", "Peru", "landmarks", "photo-1526392060635-9d6019884377", 4.9, 8120, "Full day", 89, false],
  ["cappadocia-balloon", "Cappadocia balloon flight", "Cappadocia", "Turkey", "adventure", "photo-1641128324972-af3212f0f6bd", 4.9, 6240, "3 hours", 165, true],
  ["eiffel-tower", "Eiffel Tower", "Paris", "France", "landmarks", "photo-1511739001486-6bfe10ce785f", 4.7, 12490, "2 hours", 38, true],
  ["great-wall", "The Great Wall", "Beijing", "China", "landmarks", "photo-1508804185872-d7badad00f7d", 4.8, 9310, "Half day", 45, true],
  ["savanna-safari", "Savanna safari drive", "Nairobi", "Kenya", "adventure", "photo-1516426122078-c23e76319801", 4.8, 2875, "Full day", 140, true],
  ["northern-lights", "Northern lights tour", "Tromso", "Norway", "nature", "photo-1531366936337-7c912a4589a7", 4.7, 1980, "6 hours", 120, false],
  ["giza-pyramids", "Pyramids of Giza", "Cairo", "Egypt", "landmarks", "photo-1553913861-c0fddf2619ee", 4.7, 7760, "Half day", 48, true],
  ["alpine-lake", "Alpine lake boat trip", "The Alps", "Italy", "nature", "photo-1476514525535-07fb3b4ae5f1", 4.6, 1120, "2 hours", 36, true],
  ["table-mountain", "Table Mountain views", "Cape Town", "South Africa", "nature", "photo-1580060839134-75a5edca2e99", 4.8, 5410, "3 hours", 29, true],
  ["bali-temple", "Lakeside temple visit", "Bali", "Indonesia", "landmarks", "photo-1537996194471-e657df975ab4", 4.6, 3320, "Half day", 22, true],
  ["santorini-sunset", "Santorini sunset walk", "Santorini", "Greece", "city", "photo-1570077188670-e3a8d69ac5ff", 4.8, 2640, "3 hours", 42, true],
  ["tokyo-night", "Tokyo after dark food tour", "Tokyo", "Japan", "city", "photo-1540959733332-eab4deabeeaf", 4.9, 4120, "4 hours", 75, true],
  ["dubai-skyline", "Dubai skyline tour", "Dubai", "United Arab Emirates", "city", "photo-1512453979798-5ea266f8880c", 4.5, 3890, "4 hours", 58, false],
  ["sydney-harbour", "Sydney harbour cruise", "Sydney", "Australia", "city", "photo-1506973035872-a4ec16b8e8d9", 4.7, 2210, "2 hours", 54, true],
];

// Sample activities with the same shape as GET /attractions/search. Ratings and prices are made up.
const attractions: Attraction[] = rows.map(
  ([slug, name, city, country, category, photoId, rating, reviewCount, duration, price, freeCancellation], index) => ({
    id: String(index + 1),
    slug,
    name,
    city,
    country,
    category,
    imageUrl: unsplashImage(photoId),
    rating,
    reviewCount,
    duration,
    price,
    currency: "USD",
    freeCancellation,
  }),
);

export default attractions;
