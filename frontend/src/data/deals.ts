import type { DealCampaign, Promotion } from "@/types";
import homeContent from "./home";
import unsplashImage from "./unsplashImage";

type SampleDealLinks = {
  hotelSlugs?: string[];
  attractionSlugs?: string[];
  flightDealIds?: string[];
};

// Same shape as GET /deals. Used until API_URL is set. Each headline matches the sample prices it links to.
export const dealCampaigns: DealCampaign[] = [
  {
    slug: "winter-sun",
    title: "Winter sun escapes",
    subtitle: "Warm beach and city stays for the cooler months.",
    headline: "Up to 18% off",
    imageUrl: unsplashImage("photo-1537996194471-e657df975ab4", 1200),
    product: "hotels",
    startsAt: "2026-11-01",
    endsAt: "2027-02-28",
  },
  {
    slug: "city-breaks",
    title: "Short city breaks",
    subtitle: "Characterful stays for a few days away.",
    headline: "Up to 14% off",
    imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 1200),
    product: "hotels",
    startsAt: "2026-11-01",
    endsAt: "2027-01-31",
  },
  {
    slug: "new-york-fares",
    title: "Flights to and from New York",
    subtitle: "Sample fares on popular routes this winter.",
    headline: "Fares from $229",
    imageUrl: unsplashImage("photo-1500835556837-99ac94a94552", 1200),
    product: "flights",
    startsAt: "2026-11-01",
    endsAt: "2026-12-31",
  },
  {
    slug: "landmark-days",
    title: "Landmark days out",
    subtitle: "Tickets to famous sights around the world.",
    headline: "Tickets from $38",
    imageUrl: unsplashImage("photo-1511739001486-6bfe10ce785f", 1200),
    product: "attractions",
    startsAt: "2026-11-01",
    endsAt: "2027-03-31",
  },
  {
    slug: "autumn-send-off",
    title: "Autumn send-off",
    subtitle: "This campaign has ended, so it stays hidden.",
    headline: "Up to 12% off",
    imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 1200),
    product: "hotels",
    startsAt: "2026-09-01",
    endsAt: "2026-10-31",
  },
];

// What each campaign links to. GET /deals/:slug returns these as full records.
export const dealCampaignLinks: Record<string, SampleDealLinks> = {
  "winter-sun": { hotelSlugs: ["mirror-pool-villas", "azure-cliff-resort", "marina-sky-hotel", "orchid-bay-hotel"] },
  "city-breaks": { hotelSlugs: ["palm-court-marrakech", "sakura-house-tokyo"] },
  "new-york-fares": { flightDealIds: ["1", "2", "11"] },
  "landmark-days": { attractionSlugs: ["eiffel-tower", "great-wall", "giza-pyramids"] },
  "autumn-send-off": { hotelSlugs: ["sakura-house-tokyo"] },
};

const promotionHrefs: Record<string, string> = {
  "hotels-10": "/hotels",
  "trains-5": "/trains",
  "tours-10": "/attractions",
  "cars-8": "/cars",
  "flights-5": "/flights",
};

export const dealPromotions: Promotion[] = homeContent.promotions.items.map((promotion) => ({
  ...promotion,
  ctaLabel: "Browse",
  ctaHref: promotionHrefs[promotion.id] ?? "/",
}));
