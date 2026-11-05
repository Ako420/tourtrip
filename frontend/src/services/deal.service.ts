import { connection } from "next/server";
import { attractions, dealCampaignLinks, dealCampaigns, dealPromotions, flightDeals, hotels } from "@/data";
import type { DealCampaign, DealCampaignDetails, DealsContent, HotelSummary } from "@/types";
import { ApiError, apiGet, isApiLive } from "./http";

const HOT_DEAL_COUNT = 4;

// Ended campaigns drop out on their own. The check reads today's date, so it runs per request.
const getToday = async () => {
  await connection();

  return new Date().toISOString().slice(0, 10);
};

const isLive = (campaign: DealCampaign, today: string) => {
  return campaign.startsAt <= today && today <= campaign.endsAt;
};

const getSaving = ({ originalPrice, pricePerNight }: HotelSummary) => {
  return originalPrice ? 1 - Number(pricePerNight) / Number(originalPrice) : 0;
};

export const getDeals = async (): Promise<DealsContent> => {
  if (isApiLive("deals")) {
    return apiGet<DealsContent>("/deals");
  }

  const today = await getToday();

  return {
    campaigns: dealCampaigns.filter((campaign) => isLive(campaign, today)),
    hotelDeals: hotels
      .filter((hotel) => getSaving(hotel) > 0)
      .toSorted((a, b) => getSaving(b) - getSaving(a))
      .slice(0, HOT_DEAL_COUNT),
    flightDeals: flightDeals
      .filter((deal) => deal.departDate > today)
      .toSorted((a, b) => Number(a.price) - Number(b.price))
      .slice(0, HOT_DEAL_COUNT),
    promotions: dealPromotions,
  };
};

export const getDealCampaign = async (slug: string): Promise<DealCampaignDetails | null> => {
  if (!isApiLive("deals")) {
    const today = await getToday();
    const campaign = dealCampaigns.find((item) => item.slug === slug && isLive(item, today));

    if (!campaign) return null;

    const links = dealCampaignLinks[campaign.slug];

    return {
      ...campaign,
      hotels: hotels.filter((hotel) => links?.hotelSlugs?.includes(hotel.slug)),
      attractions: attractions.filter((attraction) => links?.attractionSlugs?.includes(attraction.slug)),
      flightDeals: flightDeals.filter((deal) => links?.flightDealIds?.includes(deal.id)),
    };
  }

  try {
    return await apiGet<DealCampaignDetails>(`/deals/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};
