import { prisma } from "../config/db.js";

export const getAllRooms = () => {
  return prisma.room.findMany({ orderBy: { number: "asc" } });
};

export const createRoom = ({ number, type, pricePerNight }) => {
  return prisma.room.create({ data: { number, type, pricePerNight } });
};
