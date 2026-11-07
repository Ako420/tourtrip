import { GUIDES_PAGE_SIZE } from "@/constants";
import { guides } from "@/data";
import type { Guide, GuideFilters, GuideListResult } from "@/types";
import { ApiError, apiGet, isApiLive } from "./http";

const MORE_GUIDE_COUNT = 3;

export const getGuides = async ({ city, page }: GuideFilters): Promise<GuideListResult> => {
  if (isApiLive("guides")) {
    return apiGet<GuideListResult>("/guides", { city, page });
  }

  const matches = guides.filter((guide) => !city || guide.city === city);
  const pageCount = Math.max(Math.ceil(matches.length / GUIDES_PAGE_SIZE), 1);
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * GUIDES_PAGE_SIZE;

  return {
    items: matches.slice(start, start + GUIDES_PAGE_SIZE),
    cities: guides.map((guide) => guide.city),
    total: matches.length,
    page: currentPage,
    pageCount,
  };
};

export const getGuidesByCity = async (cities: string[]): Promise<Guide[]> => {
  const results = await Promise.all(cities.map((city) => getGuides({ city, page: 1 })));

  return results.flatMap((result) => result.items);
};

export const getGuideBySlug = async (slug: string): Promise<Guide | null> => {
  if (!isApiLive("guides")) {
    return guides.find((guide) => guide.slug === slug) ?? null;
  }

  try {
    return await apiGet<Guide>(`/guides/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getMoreGuides = async (guide: Guide): Promise<Guide[]> => {
  const { items } = await getGuides({ page: 1 });

  return items.filter((item) => item.slug !== guide.slug).slice(0, MORE_GUIDE_COUNT);
};
