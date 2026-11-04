import type { attractionCategories, attractionSortOptions } from "@/constants";
import type { HotelPolicy, HotelReview, NearbyPlace, ReviewScore } from "./hotel";
import type { RecommendationTab, Section } from "./home";

export type AttractionCategory = (typeof attractionCategories)[number]["id"];
export type AttractionSort = (typeof attractionSortOptions)[number]["value"];

export type Attraction = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  category: Exclude<AttractionCategory, "all">;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  duration: string;
  price: number | string;
  currency: string;
  freeCancellation: boolean;
};

export type TrendingDestination = {
  id: string;
  name: string;
  imageUrl: string;
};

export type AttractionFilters = {
  query?: string;
  category: AttractionCategory;
  freeCancellation: boolean;
  sort: AttractionSort;
  page: number;
};

export type AttractionSearchResult = {
  items: Attraction[];
  total: number;
  page: number;
  pageCount: number;
};

export type AttractionsContent = {
  hero: { title: string; subtitle: string; imageUrl: string };
  quickSearches: string[];
  trending: Section<TrendingDestination>;
  resultsTitle: string;
  recommendations: Section<RecommendationTab>;
};

export type TicketOption = {
  id: string;
  name: string;
  description: string;
  includes: string[];
  adultPrice: number | string;
  childPrice: number | string;
};

export type AttractionDetails = Attraction & {
  description: string;
  highlights: string[];
  address: string;
  tickets: TicketOption[];
  reviewScores: ReviewScore[];
  reviews: HotelReview[];
  policies: HotelPolicy[];
  nearby: NearbyPlace[];
};
