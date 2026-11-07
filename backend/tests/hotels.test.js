import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedHotels } from "../prisma/seed-hotels.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));

// The frontend's list in src/data/destinations.ts.
const DESTINATIONS = [
  "Bali", "Cape Town", "Dubai", "Hong Kong", "Lisbon", "Marrakech",
  "Nairobi", "Paris", "Phuket", "Rome", "Singapore", "Tokyo",
];

const SUMMARY_KEYS = [
  "amenities", "area", "breakfastIncluded", "city", "country", "currency", "featuredRoom", "freeCancellation",
  "id", "imageUrl", "name", "pricePerNight", "rating", "reviewCount", "slug", "stars",
];

const search = (query) => api.get(`/api/hotels${query}`);

const slugs = (response) => response.body.map(({ slug }) => slug);

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedHotels();
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/hotels", () => {
  it("returns every hotel in the sample order", async () => {
    const response = await search("");

    assert.equal(response.status, 200);
    assert.deepEqual(slugs(response), samples.map(({ slug }) => slug));
  });

  it("returns the HotelSummary shape", async () => {
    const response = await search("");

    for (const hotel of response.body) {
      const keys = Object.keys(hotel).filter((key) => key !== "originalPrice").sort();

      assert.deepEqual(keys, SUMMARY_KEYS);
    }
  });

  it("includes amenities and the featured room", async () => {
    const response = await search("");
    const [hotel] = response.body;
    const [sample] = samples;

    assert.equal(hotel.amenities.length, sample.amenities.length);
    assert.deepEqual(hotel.featuredRoom, sample.featuredRoom);
  });

  const matches = {
    "a city": ["Bali", "Bali"],
    "a city in another letter case": ["bALi", "Bali"],
    "part of a city": ["ali", "Bali"],
    "a country": ["Indonesia", "Bali"],
    "a hotel name": ["Azure Cliff", "Bali"],
  };

  for (const [name, [destination, city]] of Object.entries(matches)) {
    it(`finds hotels by ${name}`, async () => {
      const response = await search(`?destination=${encodeURIComponent(destination)}`);

      assert.ok(response.body.length > 0);
      assert.ok(response.body.every((hotel) => hotel.city === city));
    });
  }

  it("ignores spaces around the destination", async () => {
    const response = await search(`?destination=${encodeURIComponent("  Bali  ")}`);

    assert.ok(response.body.length > 0);
  });

  it("treats an empty destination as no filter", async () => {
    const response = await search("?destination=");

    assert.equal(response.body.length, samples.length);
  });

  it("returns an empty list when nothing matches", async () => {
    const response = await search("?destination=Atlantis");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  for (const text of ["%", "_", "B%i", "B_li", "\\", "\\Bali"]) {
    it(`treats ${text} as plain text, not a wildcard`, async () => {
      const response = await search(`?destination=${encodeURIComponent(text)}`);

      assert.deepEqual(response.body, []);
    });
  }

  it("accepts the frontend's other search values", async () => {
    const response = await search("?destination=Bali&rooms=1&adults=2&children=0&checkIn=2026-12-10&checkOut=2026-12-13");

    assert.equal(response.status, 200);
    assert.ok(response.body.length > 0);
  });

  it("rejects a repeated destination", async () => {
    const response = await search("?destination=Bali&destination=Rome");

    assert.equal(response.status, 400);
    assert.deepEqual(response.body.errors, [{ path: "destination", message: "Enter a destination" }]);
  });

  it("rejects a null byte in the destination", async () => {
    const response = await search("?destination=%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("rejects a very long destination", async () => {
    const response = await search(`?destination=${"x".repeat(101)}`);

    assert.equal(response.status, 400);
    assert.equal(response.body.errors[0].path, "destination");
  });
});

describe("GET /api/destinations", () => {
  it("matches the frontend's list", async () => {
    const response = await api.get("/api/destinations");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, DESTINATIONS);
  });

  it("lists a city once, in alphabetical order", async () => {
    const { id, slug, city, amenities, rooms, reviews, featuredRoom, ...data } = samples[0];

    await prisma.hotel.create({ data: { ...data, slug: "second-rome-hotel", city: "Rome" } });
    await prisma.hotel.create({ data: { ...data, slug: "first-amsterdam-hotel", city: "Amsterdam" } });

    const response = await api.get("/api/destinations");

    await prisma.hotel.deleteMany({ where: { slug: { in: ["second-rome-hotel", "first-amsterdam-hotel"] } } });

    assert.deepEqual(response.body, ["Amsterdam", ...DESTINATIONS]);
  });
});
