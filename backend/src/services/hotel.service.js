import { prisma } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";

const LATEST_REVIEWS = 5;
const SIMILAR_HOTELS = 6;

export const SUMMARY_INCLUDE = { amenities: { orderBy: { label: "asc" } }, rooms: true };

const DETAILS_INCLUDE = {
  ...SUMMARY_INCLUDE,
  rooms: { orderBy: [{ pricePerNight: "asc" }, { id: "asc" }] },
  reviews: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: LATEST_REVIEWS },
};

// % and _ are wildcards to the database, so they're escaped to match as plain text.
const toContains = (text) => ({ contains: text.replace(/[\\%_]/g, "\\$&"), mode: "insensitive" });

export const matchDestination = (destination) => {
  if (!destination) {
    return {};
  }

  const contains = toContains(destination);

  return { OR: [{ name: contains }, { city: contains }, { country: contains }] };
};

export const getHotels = ({ destination }) => {
  return prisma.hotel.findMany({
    where: matchDestination(destination),
    include: SUMMARY_INCLUDE,
    orderBy: { sortRank: "asc" },
  });
};

const findHotel = async (slug, query) => {
  const hotel = await prisma.hotel.findUnique({ where: { slug }, ...query });

  if (!hotel) {
    throw new HttpError(404, "Hotel not found", "HOTEL_NOT_FOUND");
  }

  return hotel;
};

export const getHotelBySlug = (slug) => findHotel(slug, { include: DETAILS_INCLUDE });

export const getSimilarHotels = async (slug) => {
  const { id, pricePerNight } = await findHotel(slug, { select: { id: true, pricePerNight: true } });

  // Prisma can't order by a calculation, so the closest hotels are found first and loaded after.
  const closest = await prisma.$queryRaw`
    SELECT id FROM "Hotel"
    WHERE id <> ${id}
    ORDER BY ABS("pricePerNight" - ${pricePerNight}), "sortRank", id
    LIMIT ${SIMILAR_HOTELS}
  `;
  const hotels = await prisma.hotel.findMany({
    where: { id: { in: closest.map((hotel) => hotel.id) } },
    include: SUMMARY_INCLUDE,
  });

  return closest.map(({ id }) => hotels.find((hotel) => hotel.id === id));
};

export const getDestinations = async () => {
  const hotels = await prisma.hotel.findMany({ distinct: ["city"], select: { city: true }, orderBy: { city: "asc" } });

  return hotels.map(({ city }) => city);
};
