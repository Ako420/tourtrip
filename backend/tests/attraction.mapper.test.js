import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { seedAttractions } from "../prisma/seed-attractions.js";
import { prisma } from "../src/config/db.js";
import { toAttraction, toAttractionDetails } from "../src/mappers/attraction.mapper.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/attractions.json", import.meta.url), "utf8"));
const typesFile = readFileSync(new URL("../../frontend/src/types/attraction.ts", import.meta.url), "utf8");
const hotelTypesFile = readFileSync(new URL("../../frontend/src/types/hotel.ts", import.meta.url), "utf8");

// The field names of a type in the frontend, so a new field there fails here.
const getTypeKeys = (file, name) => {
  const [, body] = file.match(new RegExp(`export type ${name} = (?:\\w+ & )?\\{\\n([\\s\\S]*?)\\n\\};`));

  return [...body.matchAll(/^ {2}(\w+)\??:/gm)].map(([, key]) => key);
};

const ATTRACTION_KEYS = getTypeKeys(typesFile, "Attraction");
const DETAILS_KEYS = [...ATTRACTION_KEYS, ...getTypeKeys(typesFile, "AttractionDetails")];
const TICKET_KEYS = getTypeKeys(typesFile, "TicketOption");
const REVIEW_KEYS = getTypeKeys(hotelTypesFile, "HotelReview");

const decimal = (value) => new Prisma.Decimal(value);

const ticket = (overrides = {}) => ({
  id: "ticket",
  attractionId: "attraction",
  name: "Standard ticket",
  description: "Entry for one person.",
  includes: ["Entry"],
  adultPrice: decimal("32"),
  childPrice: decimal("19.5"),
  dailyLimit: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const review = (overrides = {}) => ({
  id: "review",
  hotelId: null,
  attractionId: "attraction",
  userId: "user",
  bookingId: "booking",
  author: "Amara O.",
  country: "Nigeria",
  score: 4.7,
  stayDate: "October 2026",
  title: "Worth it",
  text: "Well organised.",
  photos: ["https://example.com/photo.jpg"],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const attraction = (overrides = {}) => ({
  id: "attraction",
  slug: "colosseum",
  name: "The Colosseum",
  city: "Rome",
  country: "Italy",
  category: "landmarks",
  imageUrl: "https://example.com/colosseum.jpg",
  rating: 4.8,
  reviewCount: 3685,
  duration: "2 hours",
  price: decimal("32"),
  currency: "USD",
  freeCancellation: true,
  sortRank: 3,
  description: "An ancient arena.",
  highlights: ["See the arena"],
  address: "1 Piazza del Colosseo",
  reviewScores: [{ id: "value", label: "Value", score: 4.6 }],
  policies: [{ id: "entry", title: "Entry", description: "Show your ticket.", iconName: "ticket" }],
  nearby: [{ id: "station", name: "Metro", distance: "300 m", iconName: "train" }],
  createdAt: new Date(),
  updatedAt: new Date(),
  tickets: [ticket()],
  reviews: [review()],
  ...overrides,
});

const sortKeys = (value) => {
  return JSON.stringify(value, (key, item) => {
    return item && typeof item === "object" && !Array.isArray(item) ? Object.fromEntries(Object.entries(item).sort()) : item;
  });
};

describe("the frontend's types", () => {
  it("can be read by these tests", () => {
    assert.ok(ATTRACTION_KEYS.includes("freeCancellation"));
    assert.ok(DETAILS_KEYS.includes("tickets"));
    assert.ok(TICKET_KEYS.includes("childPrice"));
    assert.ok(REVIEW_KEYS.includes("stayDate"));
  });
});

describe("toAttraction", () => {
  it("returns exactly the keys of Attraction", () => {
    assert.deepEqual(Object.keys(toAttraction(attraction())).sort(), ATTRACTION_KEYS.toSorted());
  });

  it("leaves out internal fields", () => {
    const result = toAttraction(attraction());

    for (const field of ["sortRank", "createdAt", "updatedAt", "tickets", "reviews", "description"]) {
      assert.equal(field in result, false);
    }
  });

  it("sends the price as a string with two decimals", () => {
    assert.equal(toAttraction(attraction()).price, "32.00");
    assert.equal(toAttraction(attraction({ price: decimal("32.5") })).price, "32.50");
  });

  it("keeps the rating as a number", () => {
    assert.equal(toAttraction(attraction()).rating, 4.8);
  });

  it("passes every other field through", () => {
    const result = toAttraction(attraction());

    assert.deepEqual(
      [result.id, result.slug, result.name, result.city, result.country, result.category, result.imageUrl],
      ["attraction", "colosseum", "The Colosseum", "Rome", "Italy", "landmarks", "https://example.com/colosseum.jpg"],
    );
    assert.deepEqual([result.reviewCount, result.duration, result.currency], [3685, "2 hours", "USD"]);
    assert.equal(result.freeCancellation, true);
  });

  it("doesn't need tickets or reviews, because lists don't load them", () => {
    assert.doesNotThrow(() => toAttraction(attraction({ tickets: undefined, reviews: undefined })));
  });
});

describe("toAttractionDetails", () => {
  it("returns exactly the keys of AttractionDetails", () => {
    assert.deepEqual(Object.keys(toAttractionDetails(attraction())).sort(), DETAILS_KEYS.toSorted());
  });

  it("returns tickets with only the TicketOption keys, hiding dailyLimit", () => {
    const [result] = toAttractionDetails(attraction()).tickets;

    assert.deepEqual(Object.keys(result).sort(), TICKET_KEYS.toSorted());
  });

  it("sends both ticket prices as strings with two decimals", () => {
    const [result] = toAttractionDetails(attraction()).tickets;

    assert.equal(result.adultPrice, "32.00");
    assert.equal(result.childPrice, "19.50");
  });

  it("keeps what a ticket includes", () => {
    const [result] = toAttractionDetails(attraction()).tickets;

    assert.deepEqual(result.includes, ["Entry"]);
  });

  it("returns reviews with only the HotelReview keys, hiding the user and the booking", () => {
    const [result] = toAttractionDetails(attraction()).reviews;

    assert.deepEqual(Object.keys(result).sort(), REVIEW_KEYS.toSorted());
  });

  it("keeps every ticket and review, in the order given", () => {
    const result = toAttractionDetails(attraction({
      tickets: [ticket({ id: "b" }), ticket({ id: "a" })],
      reviews: [review({ id: "z" }), review({ id: "y" })],
    }));

    assert.deepEqual(result.tickets.map(({ id }) => id), ["b", "a"]);
    assert.deepEqual(result.reviews.map(({ id }) => id), ["z", "y"]);
  });

  it("stays safe with no tickets or reviews", () => {
    const result = toAttractionDetails(attraction({ tickets: [], reviews: [] }));

    assert.deepEqual(result.tickets, []);
    assert.deepEqual(result.reviews, []);
  });

  it("passes the details through", () => {
    const row = attraction();
    const result = toAttractionDetails(row);

    assert.equal(result.description, row.description);
    assert.equal(result.address, row.address);
    assert.deepEqual(result.highlights, row.highlights);
    assert.deepEqual(result.reviewScores, row.reviewScores);
    assert.deepEqual(result.policies, row.policies);
    assert.deepEqual(result.nearby, row.nearby);
  });
});

describe("with seeded data", () => {
  let rows;
  let log;

  before(async () => {
    log = console.log;
    console.log = () => {};

    await resetDatabase();
    await seedAttractions();

    rows = await prisma.attraction.findMany({
      include: { tickets: { orderBy: { adultPrice: "asc" } }, reviews: true },
      orderBy: { sortRank: "asc" },
    });
  });

  after(async () => {
    console.log = log;
    await closeDatabase();
  });

  it("reproduces every sample attraction, except price text and generated ids", () => {
    for (const [index, sample] of samples.entries()) {
      const result = toAttractionDetails(rows[index]);
      const byId = (a, b) => a.id.localeCompare(b.id);
      const asNumbers = ({ id, ...ticket }) => ({ ...ticket, adultPrice: Number(ticket.adultPrice), childPrice: Number(ticket.childPrice) });

      const actual = { ...result, price: Number(result.price), tickets: result.tickets.map(asNumbers), reviews: result.reviews.toSorted(byId) };
      const expected = { ...sample, tickets: sample.tickets.map(asNumbers), reviews: sample.reviews.toSorted(byId) };

      assert.equal(sortKeys(actual), sortKeys(expected));
    }
  });

  it("gives every seeded row the keys of Attraction", () => {
    for (const row of rows) {
      assert.deepEqual(Object.keys(toAttraction(row)).sort(), ATTRACTION_KEYS.toSorted());
    }
  });

  it("gives prices that the frontend can turn into numbers", () => {
    for (const row of rows) {
      const result = toAttractionDetails(row);

      assert.ok(Number.isFinite(Number(result.price)));
      assert.ok(result.tickets.every(({ adultPrice, childPrice }) => Number.isFinite(Number(adultPrice) + Number(childPrice))));
    }
  });
});
