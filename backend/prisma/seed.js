import { prisma } from "../src/config/db.js";
import { seedHotels } from "./seed-hotels.js";

try {
  await seedHotels();
} finally {
  await prisma.$disconnect();
}
