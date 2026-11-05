import { prisma } from "../src/config/db.js";
import { seedContent } from "./seed-content.js";
import { seedHotels } from "./seed-hotels.js";

try {
  await seedHotels();
  await seedContent();
} finally {
  await prisma.$disconnect();
}
