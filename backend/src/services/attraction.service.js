import { prisma } from "../config/db.js";
import { toContains } from "../utils/escapeLike.js";
import { HttpError } from "../utils/httpError.js";
import { getPageInfo } from "../utils/pagination.js";

const PAGE_SIZE = 8;
const LATEST_REVIEWS = 5;
const SIMILAR_ATTRACTIONS = 6;

const DETAILS_INCLUDE = {
  tickets: { orderBy: [{ adultPrice: "asc" }, { name: "asc" }] },
  reviews: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: LATEST_REVIEWS },
};

const SORTS = {
  recommended: [],
  rating: [{ rating: "desc" }],
  "price-asc": [{ price: "asc" }],
};

// Ties keep the recommended order. The id settles the rest, so an attraction can't show up on two pages.
const toOrderBy = (sort) => [...SORTS[sort], { sortRank: "asc" }, { id: "asc" }];

const matchPlace = (q) => {
  const contains = toContains(q);

  return [{ name: contains }, { city: contains }, { country: contains }];
};

const toWhere = ({ q, category, freeCancellation }) => {
  return {
    OR: q ? matchPlace(q) : undefined,
    category,
    freeCancellation: freeCancellation || undefined,
  };
};

export const searchAttractions = async ({ sort, page: requestedPage, ...filters }) => {
  const where = toWhere(filters);
  const total = await prisma.attraction.count({ where });
  const { page, pageCount, skip, take } = getPageInfo(total, requestedPage, PAGE_SIZE);
  const items = await prisma.attraction.findMany({ where, orderBy: toOrderBy(sort), skip, take });

  return { items, total, page, pageCount };
};

const findAttraction = async (slug, query) => {
  const attraction = await prisma.attraction.findUnique({ where: { slug }, ...query });

  if (!attraction) {
    throw new HttpError(404, "Attraction not found", "ATTRACTION_NOT_FOUND");
  }

  return attraction;
};

export const getAttractionBySlug = (slug) => findAttraction(slug, { include: DETAILS_INCLUDE });

export const getSimilarAttractions = async (slug) => {
  const { id, category } = await findAttraction(slug, { select: { id: true, category: true } });
  const orderBy = toOrderBy("recommended");
  const sameCategory = await prisma.attraction.findMany({
    where: { id: { not: id }, category },
    orderBy,
    take: SIMILAR_ATTRACTIONS,
  });
  const others = await prisma.attraction.findMany({
    where: { category: { not: category } },
    orderBy,
    take: SIMILAR_ATTRACTIONS - sameCategory.length,
  });

  return [...sameCategory, ...others];
};

export const getPlannerSuggestions = () => prisma.attraction.findMany({ orderBy: toOrderBy("recommended") });
