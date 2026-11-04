import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/config/db.js";
import { env } from "../src/config/env.js";

const databaseName = new URL(env.DATABASE_URL).pathname.slice(1);

// Tests write to the database, so they must never reach the development one.
if (env.NODE_ENV !== "test" || !databaseName.endsWith("_test")) {
  throw new Error(`Tests need NODE_ENV=test and a database ending in _test, not ${databaseName}`);
}

export const api = request(app);

export const resetDatabase = async () => {
  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'
  `;
  const names = tables.map(({ tablename }) => `"${tablename}"`).join(", ");

  await prisma.$executeRawUnsafe(`TRUNCATE ${names} CASCADE`);
};

export const closeDatabase = () => prisma.$disconnect();
