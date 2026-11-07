import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import { seedHotels } from "../prisma/seed-hotels.js";
import { cloudinary } from "../src/config/cloudinary.js";
import { prisma } from "../src/config/db.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));
const sampleRooms = samples.flatMap((hotel) => hotel.rooms);
const sampleReviews = samples.flatMap((hotel) => hotel.reviews);
const amenityIds = new Set(samples.flatMap((hotel) => hotel.amenities.map((amenity) => amenity.id)));

const countRows = async () => ({
  hotels: await prisma.hotel.count(),
  rooms: await prisma.roomType.count(),
  reviews: await prisma.review.count(),
  amenities: await prisma.amenity.count(),
});

const expectedCounts = {
  hotels: samples.length,
  rooms: sampleRooms.length,
  reviews: sampleReviews.length,
  amenities: amenityIds.size,
};

let log;

before(() => {
  log = console.log;
  console.log = () => {};
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

beforeEach(resetDatabase);

describe("seedHotels", () => {
  it("creates every sample row", async () => {
    await seedHotels();

    assert.deepEqual(await countRows(), expectedCounts);
  });

  it("creates no duplicates when run twice", async () => {
    await seedHotels();
    await seedHotels();

    assert.deepEqual(await countRows(), expectedCounts);
  });

  it("never uploads in test mode", async (t) => {
    const upload = t.mock.method(cloudinary.uploader, "upload", async () => ({ secure_url: "unused" }));

    await seedHotels();

    assert.equal(upload.mock.callCount(), 0);
  });

  it("keeps the sample ids, so links stay the same", async () => {
    await seedHotels();

    const [sample] = samples;
    const hotel = await prisma.hotel.findUniqueOrThrow({ where: { slug: sample.slug }, include: { rooms: true } });

    assert.equal(hotel.id, sample.id);
    assert.deepEqual(hotel.rooms.map(({ id }) => id).sort(), sample.rooms.map(({ id }) => id).sort());
  });

  it("sets each hotel's price to its lowest room price", async () => {
    await seedHotels();

    const hotels = await prisma.hotel.findMany({ include: { rooms: true } });

    for (const hotel of hotels) {
      const lowest = Math.min(...hotel.rooms.map((room) => Number(room.pricePerNight)));

      assert.equal(Number(hotel.pricePerNight), lowest, hotel.slug);
    }
  });

  it("restores a changed price when run again", async () => {
    await seedHotels();

    const [sample] = samples;
    const hotel = await prisma.hotel.update({ where: { id: sample.id }, data: { pricePerNight: 9999 } });

    assert.equal(Number(hotel.pricePerNight), 9999);

    await seedHotels();

    const fixed = await prisma.hotel.findUniqueOrThrow({ where: { id: sample.id } });
    const lowest = Math.min(...sample.rooms.map((room) => Number(room.pricePerNight)));

    assert.equal(Number(fixed.pricePerNight), lowest);
  });

  it("keeps the sample order in sortRank", async () => {
    await seedHotels();

    const hotels = await prisma.hotel.findMany({ orderBy: { sortRank: "asc" } });

    assert.deepEqual(
      hotels.map(({ slug }) => slug),
      samples.map(({ slug }) => slug),
    );
    assert.deepEqual(
      hotels.map(({ sortRank }) => sortRank),
      samples.map((_, index) => index + 1),
    );
  });

  it("keeps the sample rating and review count", async () => {
    await seedHotels();

    for (const sample of samples) {
      const hotel = await prisma.hotel.findUniqueOrThrow({ where: { id: sample.id } });

      assert.equal(hotel.rating, sample.rating);
      assert.equal(hotel.reviewCount, sample.reviewCount);
    }
  });

  it("gives every room type 5 rooms and keeps its availability", async () => {
    await seedHotels();

    const rooms = await prisma.roomType.findMany();
    const unavailable = sampleRooms.filter((room) => !room.isAvailable).map(({ id }) => id);

    assert.ok(rooms.every((room) => room.totalRooms === 5));
    assert.deepEqual(rooms.filter((room) => !room.isAvailable).map(({ id }) => id), unavailable);
  });

  it("links each hotel to its amenities", async () => {
    await seedHotels();

    for (const sample of samples) {
      const hotel = await prisma.hotel.findUniqueOrThrow({ where: { id: sample.id }, include: { amenities: true } });

      assert.deepEqual(hotel.amenities.map(({ id }) => id).sort(), sample.amenities.map(({ id }) => id).sort());
    }
  });

  it("stores the display details and gallery", async () => {
    await seedHotels();

    const [sample] = samples;
    const hotel = await prisma.hotel.findUniqueOrThrow({ where: { id: sample.id } });

    assert.deepEqual(hotel.images, sample.images);
    assert.deepEqual(hotel.highlights, sample.highlights);
    assert.deepEqual(hotel.reviewScores, sample.reviewScores);
    assert.deepEqual(hotel.policies, sample.policies);
    assert.deepEqual(hotel.nearby, sample.nearby);
  });

  it("restores a removed amenity link", async () => {
    await seedHotels();

    const [sample] = samples;

    await prisma.hotel.update({ where: { id: sample.id }, data: { amenities: { set: [] } } });
    await seedHotels();

    const hotel = await prisma.hotel.findUniqueOrThrow({ where: { id: sample.id }, include: { amenities: true } });

    assert.equal(hotel.amenities.length, sample.amenities.length);
  });

  it("dates each review by its stay", async () => {
    await seedHotels();

    const [sample] = samples;
    const [{ id, stayDate }] = sample.reviews;
    const review = await prisma.review.findUnique({ where: { id } });

    assert.equal(review.createdAt.toISOString().slice(0, 7), new Date(`1 ${stayDate} UTC`).toISOString().slice(0, 7));
  });

  it("dates reviews that were already there", async () => {
    await seedHotels();

    const [{ id }] = samples[0].reviews;
    const seeded = await prisma.review.findUnique({ where: { id } });

    await prisma.review.update({ where: { id }, data: { createdAt: new Date() } });
    await seedHotels();

    const review = await prisma.review.findUnique({ where: { id } });

    assert.deepEqual(review.createdAt, seeded.createdAt);
  });

  it("leaves rows it didn't create alone", async () => {
    await seedHotels();

    const [sample] = samples;
    const review = await prisma.review.create({
      data: {
        hotelId: sample.id,
        author: "Real Guest",
        country: "Ghana",
        score: 8,
        stayDate: "November 2026",
        title: "Nice",
        text: "A real review.",
      },
    });

    await seedHotels();

    assert.equal(await prisma.review.count({ where: { id: review.id } }), 1);
  });
});
