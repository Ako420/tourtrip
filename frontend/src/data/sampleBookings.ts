import type { BookingRecord } from "@/types";
import unsplashImage from "./unsplashImage";

export const SAMPLE_BOOKING_EMAIL = "demo@hotel-jr.test";

// Made-up trips so the lookup can be tried. POST /bookings/lookup replaces these.
const sampleBookings: BookingRecord[] = [
  {
    reference: "HJ-HOTEL1",
    type: "hotel",
    title: "Azure Cliff Resort",
    subtitle: "Garden Room, Bali",
    startDate: "2026-12-01",
    endDate: "2026-12-04",
    guests: "2 adults",
    status: "confirmed",
    total: 567,
    currency: "USD",
    imageUrl: unsplashImage("photo-1571896349842-33c89424de2d"),
    href: "/hotels/azure-cliff-resort",
  },
  {
    reference: "HJ-FLY22",
    type: "flight",
    title: "Lagos to London",
    subtitle: "Pacific Crest PC 754, Economy",
    startDate: "2026-12-10",
    endDate: "2026-12-17",
    guests: "1 adult",
    status: "confirmed",
    total: 374,
    currency: "USD",
    imageUrl: unsplashImage("photo-1500835556837-99ac94a94552"),
    href: "/flights",
  },
  {
    reference: "HJ-TOUR3",
    type: "attraction",
    title: "The Colosseum",
    subtitle: "Guided experience, Rome",
    startDate: "2026-09-14",
    guests: "2 adults, 1 child",
    status: "completed",
    total: 133,
    currency: "USD",
    imageUrl: unsplashImage("photo-1552832230-c0197dd311b5"),
    href: "/attractions/colosseum",
  },
];

export default sampleBookings;
