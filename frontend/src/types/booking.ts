import type { z } from "zod";
import type { FormState } from "./auth";
import type {
  attractionBookingTripSchema,
  bookingLookupSchema,
  bookingSchema,
  bookingStaySchema,
  carBookingTripSchema,
  flightBookingTripSchema,
  trainBookingTripSchema,
} from "@/schemas";

export type BookingValues = z.infer<typeof bookingSchema>;
export type BookingStay = z.infer<typeof bookingStaySchema>;

export type BookingRequest = Omit<BookingValues, "acceptTerms"> &
  BookingStay & {
    total: number;
    currency: string;
  };

export type BookingResponse = {
  reference: string;
};

export type FlightBookingTrip = z.infer<typeof flightBookingTripSchema>;

export type FlightBookingRequest = FlightBookingTrip & {
  passengers: { type: "adult" | "child"; firstName: string; lastName: string; birthDate: string }[];
  email: string;
  phone: string;
  total: number;
  currency: string;
};

export type AttractionBookingTrip = z.infer<typeof attractionBookingTripSchema>;

export type AttractionBookingRequest = AttractionBookingTrip & {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  total: number;
  currency: string;
};

export type BookingLookup = z.infer<typeof bookingLookupSchema>;

export type BookingRecord = {
  reference: string;
  type: "hotel" | "flight" | "attraction" | "car" | "train";
  title: string;
  subtitle: string;
  startDate: string;
  endDate?: string;
  guests: string;
  status: "confirmed" | "completed" | "cancelled";
  total: number | string;
  currency: string;
  imageUrl: string;
  href: string;
};

export type BookingLookupState = FormState<BookingRecord>;

export type CarBookingTrip = z.infer<typeof carBookingTripSchema>;

export type CarBookingRequest = CarBookingTrip & {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  total: number;
  currency: string;
};

export type TrainBookingTrip = z.infer<typeof trainBookingTripSchema>;

export type TrainBookingRequest = TrainBookingTrip & {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  total: number;
  currency: string;
};
