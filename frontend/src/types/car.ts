import type { carCategories, carSortOptions, carTransmissions } from "@/constants";
import type { LinkItem, RecommendationTab, Section } from "./home";
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

export type CarCategoryDeal = {
  id: CarCategory;
  label: string;
  fromPrice: number | string;
  currency: string;
  imageUrl: string;
};

export type CarSearchResult = {
  items: CarOffer[];
  total: number;
  page: number;
  pageCount: number;
  days: number;
  suppliers: string[];
  categories: CarCategoryDeal[];
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

export type CarReview = {
  id: string;
  author: string;
  score: number;
  date: string;
  carType: string;
  text: string;
};

export type CarGuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  points: { label: string; text: string }[];
};

export type CarsContent = {
  hero: { title: string; imageUrl: string };
  offer: { title: string; points: string[]; ctaLabel: string; ctaHref: string };
  benefits: TrustItem[];
  sectionLinks: LinkItem[];
  types: Section<CarTypeTile>;
  cities: Section<CarCity>;
  reviews: Section<CarReview> & { note: string };
  suppliers: Section<string> & { note: string };
  faqs: Section<FlightTip>;
  guide: Section<CarGuideSection>;
  recommendations: Section<RecommendationTab>;
};
