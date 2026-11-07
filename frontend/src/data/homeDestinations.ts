import { toFlightDealHref } from "@/lib";
import type { FlightDeal, HomeDestination } from "@/types";
import attractions from "./attractions";
import flightDeals from "./flightDeals";
import guides from "./guides";
import homeContent from "./home";
import hotels from "./hotels";

const tiles = homeContent.inspiration.items.filter((tile) => tile.id !== "anywhere");

const getRouteImage = (deal: FlightDeal, city: string, fallback: string) => {
  const otherCity = deal.to === city ? deal.from : deal.to;

  return tiles.find((tile) => tile.name === otherCity)?.imageUrl ?? fallback;
};

// Same shape as GET /home/destinations. Everything comes from the sample hotels, attractions, guides and fares.
const homeDestinations: HomeDestination[] = tiles.map(({ id, name, imageUrl }) => ({
  id,
  name,
  sights: attractions
    .filter((attraction) => attraction.city === name)
    .map((attraction) => ({
      id: attraction.id,
      name: attraction.name,
      city: attraction.city,
      imageUrl: attraction.imageUrl,
      rating: attraction.rating,
      reviewCount: attraction.reviewCount,
      href: `/attractions/${attraction.slug}`,
    })),
  moments: guides
    .filter((guide) => guide.city === name)
    .map((guide) => ({
      id: guide.id,
      title: guide.title,
      location: guide.city,
      imageUrl: guide.coverUrl,
      href: `/inspiration/${guide.slug}`,
    })),
  hotels: hotels.filter((hotel) => hotel.city === name),
  routes: flightDeals
    .filter((deal) => deal.from === name || deal.to === name)
    .map((deal) => ({
      id: deal.id,
      from: deal.from,
      to: deal.to,
      date: deal.departDate,
      price: deal.price,
      currency: deal.currency,
      imageUrl: getRouteImage(deal, name, imageUrl),
      href: toFlightDealHref(deal),
    })),
}));

export default homeDestinations;
