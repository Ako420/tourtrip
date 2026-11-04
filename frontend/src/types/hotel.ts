import type { hotelSortOptions, IconName } from "@/constants";

export type Amenity = {
  id: string;
  label: string;
  iconName: IconName;
};

export type HotelSummary = {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  country: string;
  imageUrl: string;
  stars: number;
  rating: number;
  reviewCount: number;
  // Number or Decimal string, since Prisma serialises Decimal columns as strings.
  pricePerNight: number | string;
  originalPrice?: number | string;
  currency: string;
  amenities: Amenity[];
  freeCancellation: boolean;
  breakfastIncluded: boolean;
  featuredRoom: { name: string; beds: string };
};

export type HotelRoom = {
  id: string;
  name: string;
  beds: string;
  maxGuests: number;
  pricePerNight: number | string;
  isAvailable: boolean;
  imageUrl: string;
  sizeSqm: number;
  freeCancellation: boolean;
  breakfastIncluded: boolean;
};

export type ReviewScore = {
  id: string;
  label: string;
  score: number;
};

export type HotelReview = {
  id: string;
  author: string;
  country: string;
  score: number;
  stayDate: string;
  title: string;
  text: string;
};

export type HotelPolicy = {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
};

export type NearbyPlace = {
  id: string;
  name: string;
  distance: string;
  iconName: IconName;
};

export type HotelDetails = HotelSummary & {
  address: string;
  description: string;
  images: string[];
  highlights: string[];
  rooms: HotelRoom[];
  reviewScores: ReviewScore[];
  reviews: HotelReview[];
  policies: HotelPolicy[];
  nearby: NearbyPlace[];
};

export type GuestCounts = {
  rooms: number;
  adults: number;
  children: number;
};

export type HotelSearch = GuestCounts & {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
};

export type HotelSort = (typeof hotelSortOptions)[number]["value"];

export type HotelFilters = {
  minPrice?: number;
  maxPrice?: number;
  stars: number[];
  minRating?: number;
  amenities: string[];
  freeCancellation: boolean;
  breakfast: boolean;
  sort: HotelSort;
  page: number;
};

export type HotelSearchResult = {
  items: HotelSummary[];
  total: number;
  page: number;
  pageCount: number;
  priceRange: { min: number; max: number };
  amenities: Amenity[];
};
