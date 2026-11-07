import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedHotels } from "../prisma/seed-hotels.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));

const SIMILAR_HOTELS = 6;

const SUMMARY_KEYS = [
  "amenities", "area", "breakfastIncluded", "city", "country", "currency", "featuredRoom", "freeCancellation",
  "id", "imageUrl", "name", "pricePerNight", "rating", "reviewCount", "slug", "stars",
];

const getSimilar = (slug) => api.get(`/api/hotels/${slug}/similar`);

const slugs = (response) => response.body.map(({ slug }) => slug);

const addHotel = (slug, pricePerNight, sortRank = 0, id = slug) => {
  const { amenities, rooms, reviews, featuredRoom, ...data } = samples[0];

  return prisma.hotel.create({ data: { ...data, id, slug, pricePerNight, sortRank } });
};

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

describe("GET /api/hotels/:slug/similar", () => {
  for (const sample of samples) {
    it(`returns the six hotels closest in price to ${sample.slug}`, async () => {
      const distance = (hotel) => Math.abs(hotel.pricePerNight - sample.pricePerNight);
      const expected = samples
        .filter(({ slug }) => slug !== sample.slug)
        .toSorted((a, b) => distance(a) - distance(b))
        .slice(0, SIMILAR_HOTELS);

      const response = await getSimilar(sample.slug);

      assert.equal(response.status, 200);
      assert.deepEqual(slugs(response), expected.map(({ slug }) => slug));
    });
  }

  it("returns the HotelSummary shape", async () => {
    const response = await getSimilar(samples[0].slug);

    for (const hotel of response.body) {
      const keys = Object.keys(hotel).filter((key) => key !== "originalPrice").sort();

      assert.deepEqual(keys, SUMMARY_KEYS);
    }
  });

  it("includes amenities, the featured room and money text", async () => {
    const response = await getSimilar(samples[0].slug);
    const [hotel] = response.body;
    const sample = samples.find(({ slug }) => slug === hotel.slug);

    assert.equal(hotel.amenities.length, sample.amenities.length);
    assert.deepEqual(hotel.featuredRoom, sample.featuredRoom);
    assert.equal(hotel.pricePerNight, `${sample.pricePerNight}.00`);
  });

  it("looks at hotels in every city", async () => {
    const response = await getSimilar(samples[0].slug);
    const cities = new Set(response.body.map(({ city }) => city));

    assert.equal(cities.size, SIMILAR_HOTELS);
  });

  describe("close prices", () => {
    before(async () => {
      await addHotel("cents-target", "5000.60", 900);
      await addHotel("cents-higher", "5000.85", 901);
      await addHotel("cents-lower", "5000.45", 902);
      await addHotel("same-target", "7000.00", 5);
      await addHotel("same-rank-k", "7000.25", 7, "rank-k");
      await addHotel("same-rank-a", "7000.25", 7, "rank-a");
      await addHotel("same-rank-z", "7000.25", 7, "rank-z");
      await addHotel("same-rank-low", "7000.25", 6, "rank-m");
    });

    after(() => prisma.hotel.deleteMany({ where: { pricePerNight: { gte: 5000 } } }));

    it("keeps cents when working out what's closest", async () => {
      const response = await getSimilar("cents-target");

      assert.deepEqual(slugs(response).slice(0, 2), ["cents-lower", "cents-higher"]);
    });

    it("counts a dearer and a cheaper hotel the same distance, so rank decides", async () => {
      await addHotel("tie-above", "9500.00", 2);
      await addHotel("tie-target", "9000.00", 1);
      await addHotel("tie-below", "8500.00", 1);

      const response = await getSimilar("tie-target");

      assert.deepEqual(slugs(response).slice(0, 2), ["tie-below", "tie-above"]);
    });

    it("settles a tie by rank, then id", async () => {
      const response = await getSimilar("same-target");

      assert.deepEqual(slugs(response).slice(0, 4), ["same-rank-low", "same-rank-a", "same-rank-k", "same-rank-z"]);
    });
  });
});

describe("GET /api/hotels/:slug/similar unknown slugs", () => {
  it("returns 404 for an unknown slug", async () => {
    const response = await getSimilar("no-such-hotel");

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { message: "Hotel not found", code: "HOTEL_NOT_FOUND" });
  });

  it("rejects a null byte", async () => {
    const response = await getSimilar("%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });
});

// Last, because it clears the hotels the tests above use.
describe("GET /api/hotels/:slug/similar with few hotels", () => {
  before(async () => {
    await resetDatabase();
  });

  it("returns an empty list when there's no other hotel", async () => {
    await addHotel("only-hotel", "100.00");

    const response = await getSimilar("only-hotel");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  it("returns every other hotel when there are fewer than six", async () => {
    await addHotel("second-hotel", "120.00");
    await addHotel("third-hotel", "110.00");

    const response = await getSimilar("only-hotel");

    assert.deepEqual(slugs(response), ["third-hotel", "second-hotel"]);
  });
});
