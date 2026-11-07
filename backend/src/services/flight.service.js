import { prisma } from "../config/db.js";
import { toContains } from "../utils/escapeLike.js";

export const getAirports = async () => {
  const airports = await prisma.airport.findMany({ select: { city: true }, orderBy: { city: "asc" } });

  return airports.map(({ city }) => city);
};

export const getFlightDeals = ({ from, to, nonstop }) => {
  const today = new Date().toISOString().slice(0, 10);

  return prisma.flightDeal.findMany({
    where: {
      fromCity: from ? toContains(from) : undefined,
      toCity: to ? toContains(to) : undefined,
      isNonstop: nonstop || undefined,
      isActive: true,
      departDate: { gte: new Date(today) },
    },
    include: { airline: true },
    orderBy: [{ departDate: "asc" }, { id: "asc" }],
  });
};
