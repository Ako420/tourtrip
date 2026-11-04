import type { z } from "zod";
import type { bookingSchema, bookingStaySchema, flightBookingTripSchema } from "@/schemas";

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
