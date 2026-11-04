import type { carCategories, carSortOptions, carTransmissions } from "@/constants";
import type { Section } from "./home";
import type { FlightTip, TrustItem } from "./flight";

export type CarCategory = (typeof carCategories)[number]["id"];
export type CarSort = (typeof carSortOptions)[number]["value"];
export type CarTransmission = (typeof carTransmissions)[number];

export type CarSearch = {
  location?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  pickupTime: string;
  dropoffDate?: string;
  dropoffTime: string;
  isStandardAge: boolean;
};

export type CarFilters = {
  categories: string[];
  transmissions: string[];
  suppliers: string[];
  freeCancellation: boolean;
  sort: CarSort;
  page: number;
};

export type CarOffer = {
  id: string;
  name: string;
  category: CarCategory;
  categoryLabel: string;
  imageUrl: string;
  supplier: string;
  supplierRating: number;
  seats: number;
  bags: number;
  transmission: CarTransmission;
  hasUnlimitedMileage: boolean;
  freeCancellation: boolean;
  pricePerDay: number | string;
  totalPrice: number | string;
  currency: string;
};

export type CarSearchResult = {
  items: CarOffer[];
  total: number;
  page: number;
  pageCount: number;
  days: number;
  suppliers: string[];
};

export type CarTypeTile = {
  id: CarCategory;
  label: string;
  detail: string;
  imageUrl: string;
};

export type CarCity = {
  id: string;
  name: string;
  fromPrice: number | string;
  currency: string;
  imageUrl: string;
};

export type CarsContent = {
  hero: { title: string; imageUrl: string };
  trust: Section<TrustItem> & { moreLabel: string };
  types: Section<CarTypeTile>;
  cities: Section<CarCity>;
  faqs: Section<FlightTip>;
};
