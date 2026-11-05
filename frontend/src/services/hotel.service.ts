import { HOTELS_PAGE_SIZE } from "@/constants";
import { destinations, hotels } from "@/data";
import { toHotelQuery } from "@/lib";
import type {
  Amenity,
  HotelDetails,
  HotelFilters,
  HotelSearch,
  HotelSearchResult,
  HotelSort,
  HotelSummary,
} from "@/types";
import { ApiError, apiGet, isApiLive } from "./http";

const matchesDestination = (hotel: HotelSummary, destination?: string) => {
  const query = destination?.trim().toLowerCase();

  return !query || [hotel.name, hotel.city, hotel.country].some((value) => value.toLowerCase().includes(query));
};

const matchesFilters = (hotel: HotelSummary, filters: HotelFilters) => {
  const price = Number(hotel.pricePerNight);
  const hotelAmenities = hotel.amenities.map((amenity) => amenity.id);

  return (
    price >= (filters.minPrice ?? 0) &&
    price <= (filters.maxPrice ?? Infinity) &&
    (filters.stars.length === 0 || filters.stars.includes(hotel.stars)) &&
    hotel.rating >= (filters.minRating ?? 0) &&
    filters.amenities.every((id) => hotelAmenities.includes(id)) &&
    (!filters.freeCancellation || hotel.freeCancellation) &&
    (!filters.breakfast || hotel.breakfastIncluded)
  );
};

const sorters: Partial<Record<HotelSort, (a: HotelSummary, b: HotelSummary) => number>> = {
  "price-asc": (a, b) => Number(a.pricePerNight) - Number(b.pricePerNight),
  "price-desc": (a, b) => Number(b.pricePerNight) - Number(a.pricePerNight),
  rating: (a, b) => b.rating - a.rating,
};

export const searchHotels = async (search: HotelSearch, filters: HotelFilters): Promise<HotelSearchResult> => {
  if (isApiLive("hotels")) {
    const params = Object.fromEntries(new URLSearchParams(toHotelQuery(search, filters)));

    return apiGet<HotelSearchResult>("/hotels/search", params);
  }

  const destinationHotels = hotels.filter((hotel) => matchesDestination(hotel, search.destination));
  const matches = destinationHotels.filter((hotel) => matchesFilters(hotel, filters));
  const sorted = sorters[filters.sort] ? matches.toSorted(sorters[filters.sort]) : matches;
  const prices = destinationHotels.map((hotel) => Number(hotel.pricePerNight));
  const amenities = new Map<string, Amenity>(
    destinationHotels.flatMap((hotel) => hotel.amenities.map((amenity) => [amenity.id, amenity])),
  );
  const pageCount = Math.max(Math.ceil(sorted.length / HOTELS_PAGE_SIZE), 1);
  const page = Math.min(filters.page, pageCount);

  return {
    items: sorted.slice((page - 1) * HOTELS_PAGE_SIZE, page * HOTELS_PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
    priceRange: { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 0 },
    amenities: [...amenities.values()],
  };
};

export const getHotels = async (search: Partial<HotelSearch> = {}): Promise<HotelSummary[]> => {
  if (isApiLive("hotels")) {
    return apiGet<HotelSummary[]>("/hotels", search);
  }

  return hotels.filter((hotel) => matchesDestination(hotel, search.destination));
};

export const getHotelBySlug = async (slug: string): Promise<HotelDetails | null> => {
  if (!isApiLive("hotels")) {
    return hotels.find((hotel) => hotel.slug === slug) ?? null;
  }

  try {
    return await apiGet<HotelDetails>(`/hotels/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getSimilarHotels = async (hotel: HotelSummary): Promise<HotelSummary[]> => {
  if (isApiLive("hotels")) {
    return apiGet<HotelSummary[]>(`/hotels/${encodeURIComponent(hotel.slug)}/similar`);
  }

  const price = Number(hotel.pricePerNight);

  return hotels
    .filter((other) => other.slug !== hotel.slug)
    .toSorted((a, b) => Math.abs(Number(a.pricePerNight) - price) - Math.abs(Number(b.pricePerNight) - price))
    .slice(0, 6);
};

export const getDestinations = async (): Promise<string[]> => {
  return isApiLive("hotels") ? apiGet<string[]>("/destinations") : destinations;
};
