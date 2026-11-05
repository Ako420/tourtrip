import { prisma } from "../src/config/db.js";
import { seedContent } from "./seed-content.js";
import { seedFaqs } from "./seed-faqs.js";
import { seedFlights } from "./seed-flights.js";
import { seedHotels } from "./seed-hotels.js";

try {
  await seedHotels();
  await seedContent();
  await seedFaqs();
  await seedFlights();
} finally {
  await prisma.$disconnect();
}
