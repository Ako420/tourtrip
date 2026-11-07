import type { z } from "zod";
import type { enquirySchema } from "@/schemas";
import type { tourPaths } from "@/constants";
import type { LinkItem, RecommendationTab, Section } from "./home";

export type TourType = keyof typeof tourPaths;

export type Tour = {
  id: string;
  slug: string;
  type: TourType;
  name: string;
  city: string;
  country: string;
  summary: string;
  imageUrl: string;
  days: number;
  rating: number;
  reviewCount: number;
  price: number | string;
  currency: string;
};

export type TourDay = {
  title: string;
  description: string;
};

export type TourDeparture = {
  id: string;
  date: string;
  seatsLeft: number;
  price: number | string;
};

export type TourDetails = Tour & {
  itinerary: TourDay[];
  included: string[];
  notIncluded: string[];
  departures: TourDeparture[];
};

export type TourPlace = {
  id: string;
  name: string;
  imageUrl: string;
  href: string;
};

export type TourDestinationTab = {
  id: string;
  label: string;
  cities: string[];
};

export type ToursContent = {
  title: string;
  subtitle: string;
  imageUrl: string;
  popular: string[];
  customize?: LinkItem;
  recommended: { title: string; tabs: TourDestinationTab[] };
  cities: Section<TourPlace>;
  countries: Section<TourPlace>;
  recommendations: Section<RecommendationTab>;
};

export type EnquiryValues = z.infer<typeof enquirySchema>;

export type EnquirySubject = {
  type: "tour" | "cruise";
  slug: string;
};

export type EnquiryRequest = EnquiryValues & {
  subject: EnquirySubject;
};

export type EnquiryResponse = {
  reference: string;
};

export type EnquiryDefaults = {
  date?: string;
  travelers?: number;
};
