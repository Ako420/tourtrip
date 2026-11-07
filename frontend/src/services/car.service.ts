import { carCategories, CARS_PAGE_SIZE } from "@/constants";
import { airports, buildCarOffers, carsContent } from "@/data";
import { getRentalDays, toCarQuery } from "@/lib";
import type { CarCategoryDeal, CarFilters, CarOffer, CarSearch, CarSearchResult, CarSort, CarsContent } from "@/types";
import { apiGet, isApiLive } from "./http";

const sorters: Partial<Record<CarSort, (a: CarOffer, b: CarOffer) => number>> = {
  cheapest: (a, b) => Number(a.totalPrice) - Number(b.totalPrice),
  rating: (a, b) => b.supplierRating - a.supplierRating,
};

const matchesCarFilters = (offer: CarOffer, filters: CarFilters) => {
  return (
    (filters.categories.length === 0 || filters.categories.includes(offer.category)) &&
    (filters.transmissions.length === 0 || filters.transmissions.includes(offer.transmission)) &&
    (filters.suppliers.length === 0 || filters.suppliers.includes(offer.supplier)) &&
    (!filters.freeCancellation || offer.freeCancellation)
  );
};

// The lowest fare for each car type, ignoring the car type filter so every tile stays useful.
const getCategoryDeals = (offers: CarOffer[], filters: CarFilters): CarCategoryDeal[] => {
  const available = offers.filter((offer) => matchesCarFilters(offer, { ...filters, categories: [] }));

  return carCategories.flatMap(({ id, label }) => {
    const [cheapest] = available
      .filter((offer) => offer.category === id)
      .toSorted((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay));

    return cheapest
      ? [{ id, label, fromPrice: cheapest.pricePerDay, currency: cheapest.currency, imageUrl: cheapest.imageUrl }]
      : [];
  });
};

export const getCarsContent = async (): Promise<CarsContent> => {
  return isApiLive("content") ? apiGet<CarsContent>("/cars/content") : carsContent;
};

export const getCarLocations = async (): Promise<string[]> => {
  return isApiLive("cars") ? apiGet<string[]>("/cars/locations") : airports;
};

export const searchCars = async (search: CarSearch, filters: CarFilters): Promise<CarSearchResult> => {
  if (isApiLive("cars")) {
    return apiGet<CarSearchResult>("/cars/search", Object.fromEntries(new URLSearchParams(toCarQuery(search, filters))));
  }

  const days = getRentalDays(search);
  const offers = buildCarOffers(search, days);
  const matches = offers.filter((offer) => matchesCarFilters(offer, filters));
  const sorted = sorters[filters.sort] ? matches.toSorted(sorters[filters.sort]) : matches;
  const pageCount = Math.max(Math.ceil(sorted.length / CARS_PAGE_SIZE), 1);
  const page = Math.min(filters.page, pageCount);

  return {
    items: sorted.slice((page - 1) * CARS_PAGE_SIZE, page * CARS_PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
    days,
    suppliers: [...new Set(offers.map((offer) => offer.supplier))],
    categories: getCategoryDeals(offers, filters),
  };
};
