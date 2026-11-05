import type { seatClasses } from "@/constants";
import type { FlightLeg, FlightSort, FlightTip, FareDay, TripType, TrustItem } from "./flight";
import type { LinkItem, Section } from "./home";

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
  from: string;
  to: string;
  fromPrice: number | string;
  currency: string;
};

export type TrainRouteGroup = {
  id: string;
  title: string;
  imageUrl: string;
  routes: TrainRoute[];
};

export type TrainTravelCard = {
  id: string;
  title: string;
  imageUrl: string;
  links: LinkItem[];
  searches: LinkItem[];
};

export type TrainJourneyColumn = {
  id: string;
  title: string;
  links: LinkItem[];
};

export type TrainGuideTab = {
  id: string;
  label: string;
  cities: string[];
};

export type TrainsContent = {
  hero: { title: string; subtitle: string; imageUrl: string };
  benefits: TrustItem[];
  sectionLinks: LinkItem[];
  operators: Section<string> & { note: string };
  regions: (Section<TrainTravelCard> & { id: string })[];
  routeSections: (Section<TrainRouteGroup> & { id: string })[];
  steps: Section<FlightTip>;
  guides: { title: string; moreLabel: string; moreHref: string; tabs: TrainGuideTab[] };
  journeys: Section<TrainJourneyColumn>;
};
