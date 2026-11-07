import { connection } from "next/server";
import { cruises, cruisesContent } from "@/data";
import { toCruiseHref } from "@/lib";
import type { CruiseDetails, CruiseFilters, CruiseListing, CruiseSearchResult, CruisesContent } from "@/types";
import { ApiError, apiGet, isApiLive } from "./http";

const MORE_CRUISE_COUNT = 3;

// Past sailings drop out on their own. The check reads today's date, so it runs per request.
const getToday = async () => {
  await connection();

  return new Date().toISOString().slice(0, 10);
};

const matchesQuery = (cruise: CruiseDetails, query?: string) => {
  const text = query?.toLowerCase();

  return !text || [cruise.name, cruise.line, cruise.destination, ...cruise.route].some((value) => value.toLowerCase().includes(text));
};

export const getCruisesContent = async (): Promise<CruisesContent> => {
  return isApiLive("cruises") ? apiGet<CruisesContent>("/cruises/content") : cruisesContent;
};

export const searchCruises = async (filters: CruiseFilters): Promise<CruiseSearchResult> => {
  if (isApiLive("cruises")) {
    const params = Object.fromEntries(new URLSearchParams(toCruiseHref(filters).split("?")[1] ?? ""));

    return apiGet<CruiseSearchResult>("/cruises", params);
  }

  const today = await getToday();
  const earliest = filters.date && filters.date > today ? filters.date : today;

  const items = cruises.flatMap((cruise): CruiseListing[] => {
    const nextSailing = cruise.sailings.find((sailing) => sailing.date >= earliest);
    const matches = matchesQuery(cruise, filters.query) && (!filters.line || cruise.line === filters.line);

    return nextSailing && matches ? [{ ...cruise, nextSailingDate: nextSailing.date }] : [];
  });

  return { items, lines: [...new Set(cruises.map((cruise) => cruise.line))] };
};

export const getCruiseBySlug = async (slug: string): Promise<CruiseDetails | null> => {
  if (!isApiLive("cruises")) {
    const cruise = cruises.find((item) => item.slug === slug);

    if (!cruise) return null;

    const today = await getToday();

    return { ...cruise, sailings: cruise.sailings.filter((sailing) => sailing.date >= today) };
  }

  try {
    return await apiGet<CruiseDetails>(`/cruises/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getMoreCruises = async (cruise: CruiseDetails): Promise<CruiseListing[]> => {
  const { items } = await searchCruises({});

  return items.filter((item) => item.slug !== cruise.slug).slice(0, MORE_CRUISE_COUNT);
};
