import type { seatClasses } from "@/constants";
import type { FlightLeg, FlightSort, FlightTip, FareDay, TripType, TrustItem } from "./flight";
import type { Section } from "./home";

export type SeatClass = (typeof seatClasses)[number];

export type TrainSearch = {
  from?: string;
  to?: string;
  tripType: TripType;
  departDate?: string;
  returnDate?: string;
  adults: number;
  children: number;
  seatClass: SeatClass;
};

export type TrainFilters = {
  changes: number[];
  operators: string[];
  departureWindows: string[];
  refundable: boolean;
  sort: FlightSort;
  page: number;
};

export type TrainOffer = {
  id: string;
  operator: string;
  trainNumber: string;
  outbound: FlightLeg;
  inbound?: FlightLeg;
  seatClass: SeatClass;
  refundable: boolean;
  seatsLeft?: number;
  pricePerAdult: number | string;
  totalPrice: number | string;
  currency: string;
};

export type TrainSearchResult = {
  items: TrainOffer[];
  total: number;
  page: number;
  pageCount: number;
  currency: string;
  operators: { name: string; lowestPrice: number | string }[];
  fareCalendar: FareDay[];
  sortSummary: Partial<Record<FlightSort, number | string>>;
};

export type TrainRoute = {
  id: string;
  from: string;
  to: string;
  duration: string;
  fromPrice: number | string;
  currency: string;
  imageUrl: string;
};

export type TrainsContent = {
  hero: { title: string; subtitle: string; imageUrl: string };
  trust: Section<TrustItem> & { moreLabel: string };
  routes: Section<TrainRoute>;
  faqs: Section<FlightTip>;
};
