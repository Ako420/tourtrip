import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedHotels } from "../prisma/seed-hotels.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));

const DETAILS_KEYS = [
  "address", "amenities", "area", "breakfastIncluded", "city", "country", "currency", "description", "featuredRoom",
  "freeCancellation", "highlights", "id", "imageUrl", "images", "name", "nearby", "policies", "pricePerNight", "rating",
  "reviewCount", "reviewScores", "reviews", "rooms", "slug", "stars",
];

const ROOM_KEYS = [
  "beds", "breakfastIncluded", "freeCancellation", "id", "imageUrl", "isAvailable", "maxGuests", "name",
  "pricePerNight", "sizeSqm",
];

const REVIEW_KEYS = ["author", "country", "id", "score", "stayDate", "text", "title"];

const azure = samples.find(({ slug }) => slug === "azure-cliff-resort");

const getHotel = (slug) => api.get(`/api/hotels/${slug}`);

const addHotel = (slug) => {
  const { id, amenities, rooms, reviews, featuredRoom, ...data } = samples[0];

  return prisma.hotel.create({ data: { ...data, slug } });
};

const removeHotel = (slug) => prisma.hotel.delete({ where: { slug } });

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

describe("GET /api/hotels/:slug", () => {
  it("returns the HotelDetails shape", async () => {
    const response = await getHotel(azure.slug);
    const keys = Object.keys(response.body).filter((key) => key !== "originalPrice").sort();

    assert.equal(response.status, 200);
    assert.deepEqual(keys, DETAILS_KEYS);
  });

  for (const sample of samples) {
    it(`returns the details of ${sample.slug}`, async () => {
      const { body } = await getHotel(sample.slug);

      for (const field of ["id", "slug", "name", "area", "city", "country", "address", "description", "stars", "rating"]) {
        assert.equal(body[field], sample[field]);
      }

      assert.equal(Number(body.pricePerNight), Number(sample.pricePerNight));
      assert.equal(body.images.length, sample.images.length);
      assert.deepEqual(body.highlights, sample.highlights);
      assert.deepEqual(body.reviewScores, sample.reviewScores);
      assert.deepEqual(body.policies, sample.policies);
      assert.deepEqual(body.nearby, sample.nearby);
      assert.deepEqual(body.featuredRoom, sample.featuredRoom);
    });
  }

  it("sends prices as money text", async () => {
    const { body } = await getHotel(azure.slug);

    assert.equal(body.pricePerNight, "189.00");
    assert.equal(body.originalPrice, "229.00");
    assert.equal(body.rooms[0].pricePerNight, "189.00");
  });

  it("lists amenities by label", async () => {
    const { body } = await getHotel(azure.slug);

    assert.deepEqual(body.amenities.map(({ label }) => label), ["Beach access", "Free Wi-Fi", "Pool", "Spa"]);
  });

  it("ignores anything else in the query", async () => {
    const response = await api.get(`/api/hotels/${azure.slug}?checkIn=2026-12-10&checkOut=2026-12-13`);

    assert.equal(response.status, 200);
  });
});

describe("GET /api/hotels/:slug rooms", () => {
  it("returns the room fields and no others", async () => {
    const { body } = await getHotel(azure.slug);

    for (const room of body.rooms) {
      assert.deepEqual(Object.keys(room).sort(), ROOM_KEYS);
    }
  });

  it("keeps the room ids, because booking links use them", async () => {
    const { body } = await getHotel(azure.slug);

    assert.deepEqual(body.rooms.map(({ id }) => id), azure.rooms.map(({ id }) => id));
  });

  it("lists every hotel's rooms from cheapest to dearest, as the samples do", async () => {
    for (const sample of samples) {
      const { body } = await getHotel(sample.slug);

      assert.deepEqual(body.rooms.map(({ id }) => id), sample.rooms.map(({ id }) => id));
    }
  });

  it("keeps a sold-out room, marked as unavailable", async () => {
    const { body } = await getHotel(azure.slug);
    const soldOut = azure.rooms.find((room) => !room.isAvailable);

    assert.equal(body.rooms.find(({ id }) => id === soldOut.id).isAvailable, false);
  });

  it("keeps the same room order after a room changes", async () => {
    const [cheapest] = azure.rooms;

    await prisma.roomType.update({ where: { id: cheapest.id }, data: { sizeSqm: { increment: 1 } } });

    const { body } = await getHotel(azure.slug);

    await prisma.roomType.update({ where: { id: cheapest.id }, data: { sizeSqm: { decrement: 1 } } });

    assert.equal(body.rooms[0].id, cheapest.id);
  });

  it("sorts by price, not by id", async () => {
    const hotel = await addHotel("room-prices");
    const room = { hotelId: hotel.id, name: "Room", beds: "1 bed", maxGuests: 2, imageUrl: "", sizeSqm: 20 };

    await prisma.roomType.create({ data: { ...room, id: "room-a", pricePerNight: 200 } });
    await prisma.roomType.create({ data: { ...room, id: "room-z", pricePerNight: 100 } });

    const { body } = await getHotel("room-prices");

    await removeHotel("room-prices");

    assert.deepEqual(body.rooms.map(({ id }) => id), ["room-z", "room-a"]);
  });

  it("settles a price tie by id", async () => {
    const hotel = await addHotel("room-ties");
    const room = { hotelId: hotel.id, name: "Room", beds: "1 bed", maxGuests: 2, pricePerNight: 100, imageUrl: "", sizeSqm: 20 };

    await prisma.roomType.create({ data: { ...room, id: "room-z" } });
    await prisma.roomType.create({ data: { ...room, id: "room-a" } });

    const { body } = await getHotel("room-ties");

    await removeHotel("room-ties");

    assert.deepEqual(body.rooms.map(({ id }) => id), ["room-a", "room-z"]);
  });
});

describe("GET /api/hotels/:slug reviews", () => {
  const review = { author: "Guest", country: "Kenya", score: 9, stayDate: "May 2026", title: "Nice", text: "Lovely." };

  it("returns the review fields and no others", async () => {
    const { body } = await getHotel(azure.slug);

    for (const item of body.reviews) {
      assert.deepEqual(Object.keys(item).sort(), REVIEW_KEYS);
    }
  });

  it("shows the latest stay first", async () => {
    for (const sample of samples) {
      const { body } = await getHotel(sample.slug);
      const dates = body.reviews.map(({ stayDate }) => new Date(stayDate).getTime());

      assert.equal(body.reviews.length, sample.reviews.length);
      assert.deepEqual(dates, dates.toSorted((a, b) => b - a));
    }
  });

  it("returns only the latest 5", async () => {
    const hotel = await addHotel("review-limit");
    const dates = ["2026-01-01", "2026-06-01", "2026-03-01", "2026-05-01", "2026-02-01", "2026-04-01", "2026-07-01"];

    for (const [index, date] of dates.entries()) {
      await prisma.review.create({
        data: { ...review, id: `review-${index}`, hotelId: hotel.id, title: date, createdAt: new Date(date) },
      });
    }

    const { body } = await getHotel("review-limit");

    await removeHotel("review-limit");

    assert.deepEqual(
      body.reviews.map(({ title }) => title),
      ["2026-07-01", "2026-06-01", "2026-05-01", "2026-04-01", "2026-03-01"],
    );
  });

  it("settles a date tie by id, including which reviews make the 5", async () => {
    const hotel = await addHotel("review-ties");
    const createdAt = new Date("2026-01-01");

    // Shuffled, because with no tie-break the database returns ties in reverse order of insertion.
    for (const letter of ["d", "g", "a", "f", "c", "b", "e"]) {
      await prisma.review.create({ data: { ...review, id: `review-${letter}`, hotelId: hotel.id, createdAt } });
    }

    const { body } = await getHotel("review-ties");

    await removeHotel("review-ties");

    assert.deepEqual(
      body.reviews.map(({ id }) => id),
      ["review-g", "review-f", "review-e", "review-d", "review-c"],
    );
  });

  it("shows only this hotel's reviews", async () => {
    const { body } = await getHotel(azure.slug);

    assert.deepEqual(body.reviews.map(({ id }) => id).sort(), azure.reviews.map(({ id }) => id).sort());
  });
});

describe("GET /api/hotels/:slug with nothing attached", () => {
  it("returns empty lists for a hotel with no rooms, reviews or amenities", async () => {
    await addHotel("bare-hotel");

    const response = await getHotel("bare-hotel");

    await removeHotel("bare-hotel");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.rooms, []);
    assert.deepEqual(response.body.reviews, []);
    assert.deepEqual(response.body.amenities, []);
    assert.deepEqual(response.body.featuredRoom, { name: "", beds: "" });
  });
});

describe("GET /api/hotels/:slug unknown slugs", () => {
  const unknown = {
    "an unknown slug": "no-such-hotel",
    "a slug in another letter case": azure.slug.toUpperCase(),
    "part of a slug": "azure",
    "a wildcard": "%25",
    "a hotel's id": azure.id,
    "a space": "%20",
    "a very long slug": "x".repeat(2000),
  };

  for (const [name, slug] of Object.entries(unknown)) {
    it(`returns 404 for ${name}`, async () => {
      const response = await getHotel(slug);

      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: "Hotel not found", code: "HOTEL_NOT_FOUND" });
    });
  }

  it("rejects a null byte", async () => {
    const response = await getHotel("%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("rejects a slug that can't be decoded", async () => {
    const response = await getHotel("%E0%A4%A");

    assert.equal(response.status, 400);
  });
});

describe("GET /api/hotels routes", () => {
  it("doesn't treat search as a slug", async () => {
    const response = await api.get("/api/hotels/search");

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.items));
  });

  it("still lists hotels at the bare path", async () => {
    const response = await api.get("/api/hotels");

    assert.equal(response.status, 200);
    assert.equal(response.body.length, samples.length);
  });
});
