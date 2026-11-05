import { prisma } from "../config/db.js";
import { getPageInfo } from "../utils/pagination.js";
import { matchDestination, SUMMARY_INCLUDE } from "./hotel.service.js";

const PAGE_SIZE = 5;

const SORTS = {
  recommended: [],
  "price-asc": [{ pricePerNight: "asc" }],
  "price-desc": [{ pricePerNight: "desc" }],
  rating: [{ rating: "desc" }],
};

// Ties keep the recommended order. The id settles the rest, so a hotel can't show up on two pages.
const toOrderBy = (sort) => [...SORTS[sort], { sortRank: "asc" }, { id: "asc" }];

const toWhere = ({ destination, minPrice, maxPrice, stars, minRating, amenities, freeCancellation, breakfast }) => {
  return {
    ...matchDestination(destination),
    pricePerNight: { gte: minPrice, lte: maxPrice },
    stars: stars.length > 0 ? { in: stars } : undefined,
    rating: { gte: minRating },
    freeCancellation: freeCancellation || undefined,
    breakfastIncluded: breakfast || undefined,
    AND: amenities.map((id) => ({ amenities: { some: { id } } })),
  };
};

// Uses the destination alone, so the filter panel keeps its choices while filters are on.
const getFilterOptions = async (destination) => {
  const where = matchDestination(destination);
  const [{ _min, _max }, amenities] = await Promise.all([
    prisma.hotel.aggregate({ where, _min: { pricePerNight: true }, _max: { pricePerNight: true } }),
    prisma.amenity.findMany({ where: { hotels: { some: where } }, orderBy: { label: "asc" } }),
  ]);

  return {
    priceRange: { min: Number(_min.pricePerNight ?? 0), max: Number(_max.pricePerNight ?? 0) },
    amenities,
  };
};

export const searchHotels = async ({ sort, page: requestedPage, ...filters }) => {
  const where = toWhere(filters);
  const total = await prisma.hotel.count({ where });
  const { page, pageCount, skip, take } = getPageInfo(total, requestedPage, PAGE_SIZE);
  const items = await prisma.hotel.findMany({ where, include: SUMMARY_INCLUDE, orderBy: toOrderBy(sort), skip, take });
  const filterOptions = await getFilterOptions(filters.destination);

  return { items, total, page, pageCount, ...filterOptions };
};
