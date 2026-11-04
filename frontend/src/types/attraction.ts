import type { attractionCategories, attractionSortOptions } from "@/constants";
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
