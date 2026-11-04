import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  // The pool connects lazily, so run a query to confirm the database is reachable.
  await prisma.$queryRaw`SELECT 1`;
  console.log("Database connected");
};
