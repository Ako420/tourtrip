import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const attractionData = (overrides = {}) => ({
  slug: "lalibela-rock-churches",
  name: "Lalibela Rock Churches",
  city: "Lalibela",
  country: "Ethiopia",
  category: "landmarks",
  imageUrl: "https://example.com/attraction.jpg",
  duration: "3 hours",
  price: "25.50",
  description: "Churches carved from the rock.",
  address: "1 Church Road",
  reviewScores: [{ id: "value", label: "Value", score: 4.5 }],
  policies: [{ id: "entry", title: "Entry", description: "Show your ticket.", iconName: "ticket" }],
  nearby: [{ id: "station", name: "Bus stop", distance: "300 m", iconName: "bus" }],
  ...overrides,
});

const ticketData = (attractionId, overrides = {}) => ({
  attractionId,
  name: "Standard ticket",
  description: "Entry for one person.",
  includes: ["Entry"],
  adultPrice: "25.50",
  childPrice: "12.75",
  ...overrides,
});

const reviewData = (overrides = {}) => ({
  author: "Amara O.",
  country: "Nigeria",
  score: 4.5,
  stayDate: "October 2026",
  title: "Lovely visit",
  text: "Well worth the trip.",
  ...overrides,
});

const hotelData = {
  slug: "azure-cliff-resort",
  name: "Azure Cliff Resort",
  area: "Uluwatu",
  city: "Bali",
  country: "Indonesia",
  address: "12 Sunset Ridge",
  description: "A clifftop retreat.",
  imageUrl: "https://example.com/hotel.jpg",
  stars: 5,
  pricePerNight: "189.50",
  reviewScores: [],
  policies: [],
  nearby: [],
};

const addAttraction = (overrides) => prisma.attraction.create({ data: attractionData(overrides) });

const assertDuplicate = (attempt) => assert.rejects(attempt, { code: "P2002" });

beforeEach(resetDatabase);
after(closeDatabase);

describe("Attraction", () => {
  it("fills in its defaults", async () => {
    const attraction = await addAttraction();

    assert.equal(attraction.rating, 0);
    assert.equal(attraction.reviewCount, 0);
    assert.equal(attraction.currency, "USD");
    assert.equal(attraction.freeCancellation, false);
    assert.equal(attraction.sortRank, 0);
  });

  it("doesn't allow a repeated slug", async () => {
    await addAttraction();

    await assertDuplicate(addAttraction({ name: "Another" }));
  });

  it("keeps the cents in a price", async () => {
    const attraction = await addAttraction({ price: "25.55" });

    assert.equal(attraction.price.toFixed(2), "25.55");
  });

  it("keeps a rating out of 5 with its decimals", async () => {
    const attraction = await addAttraction({ rating: 4.7 });

    assert.equal(attraction.rating, 4.7);
  });

  for (const category of ["landmarks", "nature", "adventure", "city"]) {
    it(`accepts the ${category} category`, async () => {
      const attraction = await addAttraction({ category });

      assert.equal(attraction.category, category);
    });
  }

  it("refuses any other category", async () => {
    await assert.rejects(addAttraction({ category: "all" }));
  });

  it("stores its lists and details", async () => {
    const attraction = await addAttraction({ highlights: ["Sunrise", "Guided walk"] });

    assert.deepEqual(attraction.highlights, ["Sunrise", "Guided walk"]);
    assert.equal(attraction.reviewScores[0].score, 4.5);
    assert.equal(attraction.policies[0].iconName, "ticket");
    assert.equal(attraction.nearby[0].distance, "300 m");
  });

  it("has indexes for city, category and rating", async () => {
    const indexes = await prisma.$queryRaw`SELECT indexdef FROM pg_indexes WHERE tablename = 'Attraction'`;
    const definitions = indexes.map(({ indexdef }) => indexdef);

    for (const column of ["city", "category", "rating"]) {
      assert.ok(definitions.some((definition) => definition.includes(`(${column})`)), `no index on ${column}`);
    }
  });
});

describe("TicketOption", () => {
  it("starts with a daily limit of 200", async () => {
    const { id } = await addAttraction();
    const ticket = await prisma.ticketOption.create({ data: ticketData(id) });

    assert.equal(ticket.dailyLimit, 200);
  });

  it("keeps the cents in both prices", async () => {
    const { id } = await addAttraction();
    const ticket = await prisma.ticketOption.create({ data: ticketData(id, { adultPrice: "25.55", childPrice: "12.45" }) });

    assert.equal(ticket.adultPrice.toFixed(2), "25.55");
    assert.equal(ticket.childPrice.toFixed(2), "12.45");
  });

  it("stores what a ticket includes", async () => {
    const { id } = await addAttraction();
    const ticket = await prisma.ticketOption.create({ data: ticketData(id, { includes: ["Entry", "Guide"] }) });

    assert.deepEqual(ticket.includes, ["Entry", "Guide"]);
  });

  it("doesn't allow two tickets with one name on an attraction", async () => {
    const { id } = await addAttraction();

    await prisma.ticketOption.create({ data: ticketData(id) });

    await assertDuplicate(prisma.ticketOption.create({ data: ticketData(id) }));
  });

  it("allows the same ticket name on another attraction", async () => {
    const first = await addAttraction();
    const second = await addAttraction({ slug: "another" });

    await prisma.ticketOption.create({ data: ticketData(first.id) });
    await prisma.ticketOption.create({ data: ticketData(second.id) });

    assert.equal(await prisma.ticketOption.count(), 2);
  });

  it("goes when its attraction is removed", async () => {
    const { id } = await addAttraction();

    await prisma.ticketOption.create({ data: ticketData(id) });
    await prisma.attraction.delete({ where: { id } });

    assert.equal(await prisma.ticketOption.count(), 0);
  });
});

describe("Review", () => {
  it("can belong to an attraction, with no hotel", async () => {
    const { id } = await addAttraction();
    const review = await prisma.review.create({ data: reviewData({ attractionId: id }) });

    assert.equal(review.attractionId, id);
    assert.equal(review.hotelId, null);
  });

  it("is listed on its attraction", async () => {
    const { id } = await addAttraction();

    await prisma.review.create({ data: reviewData({ attractionId: id }) });

    const attraction = await prisma.attraction.findUnique({ where: { id }, include: { reviews: true } });

    assert.equal(attraction.reviews.length, 1);
  });

  it("goes when its attraction is removed", async () => {
    const { id } = await addAttraction();

    await prisma.review.create({ data: reviewData({ attractionId: id }) });
    await prisma.attraction.delete({ where: { id } });

    assert.equal(await prisma.review.count(), 0);
  });

  it("still goes when its hotel is removed", async () => {
    const { id } = await prisma.hotel.create({ data: hotelData });

    await prisma.review.create({ data: reviewData({ hotelId: id }) });
    await prisma.hotel.delete({ where: { id } });

    assert.equal(await prisma.review.count(), 0);
  });

  it("doesn't let an attraction's review reach a hotel's page", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData });
    const attraction = await addAttraction();

    await prisma.review.create({ data: reviewData({ hotelId: hotel.id, title: "Hotel review" }) });
    await prisma.review.create({ data: reviewData({ attractionId: attraction.id, title: "Attraction review" }) });

    const { body } = await api.get(`/api/hotels/${hotel.slug}`);

    assert.deepEqual(body.reviews.map(({ title }) => title), ["Hotel review"]);
  });

  it("has an index for listing an attraction's reviews", async () => {
    const indexes = await prisma.$queryRaw`SELECT indexdef FROM pg_indexes WHERE tablename = 'Review'`;

    assert.ok(indexes.some(({ indexdef }) => indexdef.includes('("attractionId", "createdAt")')));
  });
});
