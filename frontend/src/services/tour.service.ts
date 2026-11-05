import { connection } from "next/server";
import { tours, toursContent } from "@/data";
import type { Tour, TourDetails, ToursContent, TourType } from "@/types";
import { ApiError, apiGet, isApiEnabled } from "./http";

const MORE_TOUR_COUNT = 3;

const matchesQuery = (tour: Tour, query?: string) => {
  const text = query?.toLowerCase();

  return !text || [tour.name, tour.city, tour.country].some((value) => value.toLowerCase().includes(text));
};

export const getToursContent = async (type: TourType): Promise<ToursContent> => {
  return isApiEnabled ? apiGet<ToursContent>("/tours/content", { type }) : toursContent[type];
};

export const searchTours = async (type: TourType, query?: string): Promise<Tour[]> => {
  if (isApiEnabled) {
    return apiGet<Tour[]>("/tours", { type, q: query });
  }

  return tours.filter((tour) => tour.type === type && matchesQuery(tour, query));
};

export const getTourBySlug = async (slug: string): Promise<TourDetails | null> => {
  if (!isApiEnabled) {
    const tour = tours.find((item) => item.slug === slug);

    if (!tour) return null;

    // Past departures drop out on their own. The check reads today's date, so it runs per request.
    await connection();

    const today = new Date().toISOString().slice(0, 10);

    return { ...tour, departures: tour.departures.filter((departure) => departure.date > today) };
  }

  try {
    return await apiGet<TourDetails>(`/tours/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

export const getMoreTours = async (tour: Tour): Promise<Tour[]> => {
  const sameType = await searchTours(tour.type);

  return sameType.filter((item) => item.slug !== tour.slug).slice(0, MORE_TOUR_COUNT);
};
