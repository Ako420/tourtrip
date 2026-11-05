import type { z } from "zod";
import type { packageBookingTripSchema } from "@/schemas";
import type { FlightOffer, FlightSearch, TrustItem } from "./flight";
import type { InspirationItem, Section } from "./home";
import type { HotelRoom, HotelSummary } from "./hotel";

export type PackageSearch = Omit<FlightSearch, "tripType" | "isNonstop"> & {
  rooms: number;
};

export type PackageSelection = {
  flightId: string;
  hotelSlug: string;
  roomId: string;
};

export type PackageOffer = {
  hotel: HotelSummary;
  room: HotelRoom;
  flight: FlightOffer;
  flightTotal: number;
  hotelTotal: number;
  regularTotal: number;
  discount: number;
  totalPrice: number;
  currency: string;
};

export type PackageFlightChoice = {
  label: string;
  flight: FlightOffer;
};

export type PackageSearchResult = {
  flightChoices: PackageFlightChoice[];
  selectedFlightId?: string;
  offers: PackageOffer[];
};

export type PackagesContent = {
  hero: { title: string; subtitle: string; imageUrl: string };
  trust: Section<TrustItem> & { moreLabel: string };
  destinations: Section<InspirationItem>;
  faqs: Section<{ id: string; question: string; answer: string }>;
};

export type PackageBookingTrip = z.infer<typeof packageBookingTripSchema>;

export type PackageBookingRequest = PackageBookingTrip & {
  passengers: { type: "adult" | "child"; firstName: string; lastName: string; birthDate: string }[];
  email: string;
  phone: string;
  total: number;
  currency: string;
};
