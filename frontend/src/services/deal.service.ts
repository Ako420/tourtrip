import { connection } from "next/server";
import { attractions, dealCampaignLinks, dealCampaigns, dealsAbout, flightDeals, hotels } from "@/data";
import { toFlightDealHref } from "@/lib";
import type { DealCampaign, DealCampaignDetails, DealsContent } from "@/types";
import { ApiError, apiGet, isApiLive } from "./http";

const POPULAR_FLIGHT_COUNT = 12;

// Ended campaigns drop out on their own. The check reads today's date, so it runs per request.
const getToday = async () => {
  await connection();

  return new Date().toISOString().slice(0, 10);
};

const isLive = (campaign: DealCampaign, today: string) => {
  return campaign.startsAt <= today && today <= campaign.endsAt;
};

export const getDeals = async (): Promise<DealsContent> => {
  if (isApiLive("deals")) {
    return apiGet<DealsContent>("/deals");
  }

  const today = await getToday();

  return {
    campaigns: dealCampaigns.filter((campaign) => isLive(campaign, today)),
    about: dealsAbout,
    popularFlights: flightDeals
      .filter((deal) => deal.departDate > today)
      .toSorted((a, b) => Number(a.price) - Number(b.price))
      .slice(0, POPULAR_FLIGHT_COUNT)
      .map((deal) => ({ label: `Flights from ${deal.from} to ${deal.to}`, href: toFlightDealHref(deal) })),
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
