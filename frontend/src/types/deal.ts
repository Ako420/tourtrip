import type { dealProducts } from "@/constants";
import type { Attraction } from "./attraction";
import type { FlightDeal } from "./flight";
import type { Promotion } from "./home";
import type { HotelSummary } from "./hotel";

export type DealProduct = Exclude<(typeof dealProducts)[number]["id"], "all">;

export type DealCampaign = {
  slug: string;
  title: string;
  subtitle: string;
  headline: string;
  imageUrl: string;
  product: DealProduct;
  startsAt: string;
  endsAt: string;
};

export type DealCampaignDetails = DealCampaign & {
  hotels: HotelSummary[];
  attractions: Attraction[];
  flightDeals: FlightDeal[];
};

export type DealsContent = {
  campaigns: DealCampaign[];
  hotelDeals: HotelSummary[];
  flightDeals: FlightDeal[];
  promotions: Promotion[];
};
