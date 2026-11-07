import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const hotelData = (overrides = {}) => ({
  slug: "azure-cliff-resort",
  name: "Azure Cliff Resort",
  area: "Uluwatu",
  city: "Bali",
  country: "Indonesia",
  address: "12 Sunset Ridge, Uluwatu",
  description: "A clifftop retreat.",
  imageUrl: "https://example.com/hotel.jpg",
  stars: 5,
  pricePerNight: "189.50",
  reviewScores: [{ id: "location", label: "Location", score: 9.3 }],
  policies: [{ id: "pets", title: "Pets", description: "Not allowed.", iconName: "paw" }],
  nearby: [{ id: "station", name: "Nearest station", distance: "300 m", iconName: "train" }],
  ...overrides,
});

const roomData = (hotelId, overrides = {}) => ({
  hotelId,
  name: "Garden Room",
  beds: "1 king bed",
  maxGuests: 2,
  pricePerNight: "189.50",
  imageUrl: "https://example.com/room.jpg",
  sizeSqm: 24,
  ...overrides,
});

const reviewData = (hotelId, overrides = {}) => ({
  hotelId,
  author: "Amara O.",
  country: "Nigeria",
  score: 9.2,
  stayDate: "October 2026",
  title: "Lovely stay",
  text: "The room was spotless.",
  ...overrides,
});

beforeEach(resetDatabase);
after(closeDatabase);

describe("Hotel", () => {
  it("fills in its defaults", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });

    assert.equal(hotel.rating, 0);
    assert.equal(hotel.reviewCount, 0);
    assert.equal(hotel.currency, "USD");
    assert.equal(hotel.freeCancellation, false);
    assert.equal(hotel.breakfastIncluded, false);
    assert.equal(hotel.sortRank, 0);
    assert.equal(hotel.originalPrice, null);
    assert.deepEqual(hotel.images, []);
    assert.deepEqual(hotel.highlights, []);
  });

  it("keeps prices exact, and ratings as plain numbers", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData({ originalPrice: "229.99", rating: 9.2 }) });

    assert.equal(hotel.pricePerNight.toFixed(2), "189.50");
    assert.equal(hotel.originalPrice.toFixed(2), "229.99");
    assert.equal(typeof hotel.rating, "number");
    assert.equal(hotel.rating, 9.2);
  });

  it("stores its display details as JSON", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });

    assert.deepEqual(hotel.reviewScores, [{ id: "location", label: "Location", score: 9.3 }]);
    assert.equal(hotel.policies[0].iconName, "paw");
    assert.equal(hotel.nearby[0].distance, "300 m");
  });

  it("needs a unique slug", async () => {
    await prisma.hotel.create({ data: hotelData() });

    await assert.rejects(prisma.hotel.create({ data: hotelData() }), { code: "P2002" });
  });
});

describe("Amenity", () => {
  it("uses its text id, and links to many hotels", async () => {
    await prisma.amenity.create({ data: { id: "wifi", label: "Free Wi-Fi", iconName: "wifi" } });

    const amenities = { connect: [{ id: "wifi" }] };

    await prisma.hotel.create({ data: hotelData({ amenities }) });
    await prisma.hotel.create({ data: hotelData({ slug: "casa-do-rio", amenities }) });

    const amenity = await prisma.amenity.findUniqueOrThrow({ where: { id: "wifi" }, include: { hotels: true } });

    assert.equal(amenity.hotels.length, 2);
  });

  it("stays when a hotel using it is deleted", async () => {
    await prisma.amenity.create({ data: { id: "wifi", label: "Free Wi-Fi", iconName: "wifi" } });

    const hotel = await prisma.hotel.create({ data: hotelData({ amenities: { connect: [{ id: "wifi" }] } }) });

    await prisma.hotel.delete({ where: { id: hotel.id } });

    assert.equal(await prisma.amenity.count(), 1);
  });
});

describe("RoomType", () => {
  it("fills in its defaults", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });
    const room = await prisma.roomType.create({ data: roomData(hotel.id) });

    assert.equal(typeof room.id, "string");
    assert.equal(room.isAvailable, true);
    assert.equal(room.totalRooms, 5);
    assert.equal(room.freeCancellation, false);
    assert.equal(room.breakfastIncluded, false);
  });

  it("needs a real hotel", async () => {
    await assert.rejects(prisma.roomType.create({ data: roomData("no-such-hotel") }), { code: "P2003" });
  });

  it("is deleted with its hotel", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });

    await prisma.roomType.create({ data: roomData(hotel.id) });
    await prisma.hotel.delete({ where: { id: hotel.id } });

    assert.equal(await prisma.roomType.count(), 0);
  });
});

describe("Review", () => {
  it("can exist without a user or a booking, like the sample reviews", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });
    const review = await prisma.review.create({ data: reviewData(hotel.id) });

    assert.equal(review.userId, null);
    assert.equal(review.bookingId, null);
    assert.deepEqual(review.photos, []);
    assert.equal(typeof review.score, "number");
  });

  it("allows only one review per booking", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });

    await prisma.review.create({ data: reviewData(hotel.id, { bookingId: "booking-1" }) });

    await assert.rejects(prisma.review.create({ data: reviewData(hotel.id, { bookingId: "booking-1" }) }), {
      code: "P2002",
    });
  });

  it("stays when its author's account is deleted", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });
    const user = await prisma.user.create({
      data: { fullName: "Amara Obi", email: "amara@example.com", passwordHash: "x" },
    });
    const review = await prisma.review.create({ data: reviewData(hotel.id, { userId: user.id }) });

    await prisma.user.delete({ where: { id: user.id } });

    const kept = await prisma.review.findUniqueOrThrow({ where: { id: review.id } });

    assert.equal(kept.userId, null);
  });

  it("is deleted with its hotel", async () => {
    const hotel = await prisma.hotel.create({ data: hotelData() });

    await prisma.review.create({ data: reviewData(hotel.id) });
    await prisma.hotel.delete({ where: { id: hotel.id } });

    assert.equal(await prisma.review.count(), 0);
  });
});

describe("the old rooms API", () => {
  for (const method of ["get", "post"]) {
    it(`no longer answers ${method.toUpperCase()} /api/rooms`, async () => {
      const response = await api[method]("/api/rooms");

      assert.equal(response.status, 404);
      assert.equal(response.body.code, "ROUTE_NOT_FOUND");
    });
  }

  it("has no Room table or model left", async () => {
    const [{ count }] = await prisma.$queryRaw`
      SELECT count(*)::int FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Room'
    `;

    assert.equal(count, 0);
    assert.equal(prisma.room, undefined);
  });
});
