import { readFileSync } from "node:fs";
import { prisma } from "../src/config/db.js";
import { hostImages } from "./seed-images.js";

const SAMPLE_ATTRACTIONS = new URL("./seed-data/attractions.json", import.meta.url);

const STANDARD_TICKET = "standard";

// The sample's ticket ids repeat on every attraction, so each ticket is found by its name instead.
const seedTicket = ({ id, ...ticket }, attractionId) => {
  return prisma.ticketOption.upsert({
    where: { attractionId_name: { attractionId, name: ticket.name } },
    update: ticket,
    create: { ...ticket, attractionId },
  });
};

const seedReview = ({ id, ...review }, attractionId) => {
  // Dated by the visit, or "latest" would only mean the order this ran in.
  const data = { ...review, attractionId, createdAt: new Date(`1 ${review.stayDate} UTC`) };

  return prisma.review.upsert({ where: { id }, update: data, create: { ...data, id } });
};

const seedAttraction = async ({ id, tickets, reviews, ...attraction }, sortRank) => {
  const { adultPrice } = tickets.find((ticket) => ticket.id === STANDARD_TICKET);
  const data = { ...attraction, price: adultPrice, sortRank };

  await prisma.attraction.upsert({ where: { id }, update: data, create: { ...data, id } });

  for (const ticket of tickets) {
    await seedTicket(ticket, id);
  }

  for (const review of reviews) {
    await seedReview(review, id);
  }
};

export const seedAttractions = async () => {
  const samples = JSON.parse(readFileSync(SAMPLE_ATTRACTIONS, "utf8"));
  const attractions = await hostImages(samples, "attractions");

  for (const [index, attraction] of attractions.entries()) {
    await seedAttraction(attraction, index + 1);
  }

  console.log(`Seeded ${attractions.length} attractions`);
};
