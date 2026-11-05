import type { z } from "zod";
import type { enquirySchema } from "@/schemas";
import type { tourPaths } from "@/constants";

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

export type ToursContent = {
  title: string;
  subtitle: string;
  imageUrl: string;
  popular: string[];
};

export type EnquiryValues = z.infer<typeof enquirySchema>;

export type EnquirySubject = {
  type: "tour";
  slug: string;
};

export type EnquiryRequest = EnquiryValues & {
  subject: EnquirySubject;
};

export type EnquiryResponse = {
  reference: string;
};
