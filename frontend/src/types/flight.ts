import type { cabinOptions, flightSortOptions, IconName, tripTypes } from "@/constants";
import type { Banner, RecommendationTab, Section } from "./home";
import type { NavItem } from "./common";

export type CabinClass = (typeof cabinOptions)[number];
export type TripType = (typeof tripTypes)[number]["value"];

export type FlightSearch = {
  from?: string;
  to?: string;
  tripType: TripType;
  isNonstop: boolean;
  departDate?: string;
  returnDate?: string;
  adults: number;
  children: number;
  cabin: CabinClass;
};

export type FlightDeal = {
  id: string;
  airline: string;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  cabin: CabinClass;
  isNonstop: boolean;
  price: number | string;
  currency: string;
};

export type TrustItem = {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
};

export type FlightTip = {
  id: string;
  question: string;
  answer: string;
};

export type FlightsContent = {
  hero: { title: string; subtitle: string; imageUrl: string };
  quickLinks: NavItem[];
  trust: Section<TrustItem> & { moreLabel: string };
  trending: {
    title: string;
    caption: string;
    imageUrl: string;
    mapImageUrl: string;
    ctaLabel: string;
    ctaHref: string;
  };
  dealsTitle: string;
  app: { title: string; imageUrl: string; benefits: string[]; ctaLabel: string; ctaHref: string };
  banners: Section<Banner>;
  why: { title: string; heading: string; body: string };
  tips: Section<FlightTip>;
  recommendations: Section<RecommendationTab>;
};

export type FlightSort = (typeof flightSortOptions)[number]["value"];

export type FlightFilters = {
  stops: number[];
  airlines: string[];
  departureWindows: string[];
  maxPrice?: number;
  refundable: boolean;
  checkedBag: boolean;
  sort: FlightSort;
  page: number;
};

export type FlightLeg = {
  from: string;
  to: string;
  date: string;
  departMinutes: number;
  durationMinutes: number;
  stops: number;
  stopCity?: string;
};

export type FlightOffer = {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  outbound: FlightLeg;
  inbound?: FlightLeg;
  cabin: CabinClass;
  checkedBag: boolean;
  refundable: boolean;
  seatsLeft?: number;
  pricePerAdult: number | string;
  totalPrice: number | string;
  currency: string;
};

export type FareDay = {
  date: string;
  lowestPrice: number | string;
};

export type FlightSearchResult = {
  items: FlightOffer[];
  total: number;
  page: number;
  pageCount: number;
  currency: string;
  priceRange: { min: number; max: number };
  airlines: { name: string; lowestPrice: number | string }[];
  fareCalendar: FareDay[];
  sortSummary: Partial<Record<FlightSort, string>>;
};
