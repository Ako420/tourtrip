import { prisma } from "../config/db.js";

export const checkDatabase = async () => {
  await prisma.$queryRaw`SELECT 1`;
};
