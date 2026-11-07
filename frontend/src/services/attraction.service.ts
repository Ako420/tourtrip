import { ATTRACTIONS_PAGE_SIZE } from "@/constants";
import { attractions, attractionsContent, withAttractionDetails } from "@/data";
import { toAttractionQuery } from "@/lib";
import type {
  Attraction,
  AttractionDetails,
  AttractionFilters,
  AttractionSearchResult,
  AttractionSort,
  AttractionsContent,
} from "@/types";
import { ApiError, apiGet, isApiLive } from "./http";

const sorters: Partial<Record<AttractionSort, (a: Attraction, b: Attraction) => number>> = {
  rating: (a, b) => b.rating - a.rating,
  "price-asc": (a, b) => Number(a.price) - Number(b.price),
};

const matchesQuery = (attraction: Attraction, query?: string) => {
  const text = query?.trim().toLowerCase();

  return (
    !text ||
    [attraction.name, attraction.city, attraction.country].some((value) => value.toLowerCase().includes(text))
  );
};

export const getAttractionsContent = async (): Promise<AttractionsContent> => {
  return isApiLive("content") ? apiGet<AttractionsContent>("/attractions/content") : attractionsContent;
};

export const getAttractionBySlug = async (slug: string): Promise<AttractionDetails | null> => {
  if (!isApiLive("attractions")) {
    const attraction = attractions.find((item) => item.slug === slug);

    return attraction ? withAttractionDetails(attraction) : null;
  }

  try {
    return await apiGet<AttractionDetails>(`/attractions/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getSimilarAttractions = async (attraction: Attraction): Promise<Attraction[]> => {
  if (isApiLive("attractions")) {
    return apiGet<Attraction[]>(`/attractions/${encodeURIComponent(attraction.slug)}/similar`);
  }

  return attractions
    .filter((item) => item.slug !== attraction.slug)
    .toSorted((a, b) => Number(b.category === attraction.category) - Number(a.category === attraction.category))
    .slice(0, 6);
};

export const searchAttractions = async (filters: AttractionFilters): Promise<AttractionSearchResult> => {
  if (isApiLive("attractions")) {
    return apiGet<AttractionSearchResult>(
      "/attractions/search",
      Object.fromEntries(new URLSearchParams(toAttractionQuery(filters))),
    );
  }

  const matches = attractions.filter((attraction) => {
    return (
      matchesQuery(attraction, filters.query) &&
      (filters.category === "all" || attraction.category === filters.category) &&
      (!filters.freeCancellation || attraction.freeCancellation)
    );
  });
  const sorted = sorters[filters.sort] ? matches.toSorted(sorters[filters.sort]) : matches;
  const pageCount = Math.max(Math.ceil(sorted.length / ATTRACTIONS_PAGE_SIZE), 1);
  const page = Math.min(filters.page, pageCount);

  return {
    items: sorted.slice((page - 1) * ATTRACTIONS_PAGE_SIZE, page * ATTRACTIONS_PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
  };
};
