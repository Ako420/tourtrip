import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { seedHotels } from "../prisma/seed-hotels.js";
import { prisma } from "../src/config/db.js";
import { toHotelDetails, toHotelSummary } from "../src/mappers/hotel.mapper.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));

const SUMMARY_KEYS = [
  "amenities", "area", "breakfastIncluded", "city", "country", "currency", "featuredRoom", "freeCancellation",
  "id", "imageUrl", "name", "pricePerNight", "rating", "reviewCount", "slug", "stars",
];

const DETAILS_KEYS = [
  ...SUMMARY_KEYS, "address", "description", "highlights", "images", "nearby", "policies", "reviewScores", "reviews", "rooms",
];

const ROOM_KEYS = [
  "beds", "breakfastIncluded", "freeCancellation", "id", "imageUrl", "isAvailable", "maxGuests", "name",
  "pricePerNight", "sizeSqm",
];

const REVIEW_KEYS = ["author", "country", "id", "score", "stayDate", "text", "title"];

const decimal = (value) => new Prisma.Decimal(value);

const room = (overrides = {}) => ({
  id: "room",
  hotelId: "hotel",
  name: "Garden Room",
  beds: "1 king bed",
  maxGuests: 2,
  pricePerNight: decimal("189"),
  isAvailable: true,
  imageUrl: "https://example.com/room.jpg",
  sizeSqm: 24,
  freeCancellation: true,
  breakfastIncluded: false,
  totalRooms: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const hotel = (overrides = {}) => ({
  id: "hotel",
  slug: "azure-cliff-resort",
  name: "Azure Cliff Resort",
  area: "Uluwatu",
  city: "Bali",
  country: "Indonesia",
  address: "12 Sunset Ridge",
  description: "A clifftop retreat.",
  imageUrl: "https://example.com/hotel.jpg",
  images: [],
  highlights: [],
  stars: 5,
  rating: 9.2,
  reviewCount: 1284,
  pricePerNight: decimal("189.5"),
  originalPrice: decimal("229"),
  currency: "USD",
  freeCancellation: true,
  breakfastIncluded: true,
  sortRank: 3,
  reviewScores: [],
  policies: [],
  nearby: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  amenities: [],
  rooms: [room()],
  reviews: [],
  ...overrides,
});

const toJson = (value) => JSON.parse(JSON.stringify(value));

const sortedKeys = (value) => Object.keys(toJson(value)).sort();

describe("toHotelSummary", () => {
  it("returns the keys of HotelSummary", () => {
    assert.deepEqual(sortedKeys(toHotelSummary(hotel())), [...SUMMARY_KEYS, "originalPrice"].sort());
  });

  it("leaves out internal fields", () => {
    const summary = toHotelSummary(hotel());

    for (const key of ["sortRank", "createdAt", "updatedAt", "rooms", "reviews", "address"]) {
      assert.equal(key in summary, false, key);
    }
  });

  it("sends prices as strings with two decimals", () => {
    const summary = toHotelSummary(hotel());

    assert.equal(summary.pricePerNight, "189.50");
    assert.equal(summary.originalPrice, "229.00");
  });

  it("leaves out originalPrice when there isn't one", () => {
    assert.deepEqual(sortedKeys(toHotelSummary(hotel({ originalPrice: null }))), [...SUMMARY_KEYS].sort());
  });

  it("keeps rating as a number", () => {
    assert.equal(toHotelSummary(hotel()).rating, 9.2);
  });

  it("returns amenities without extra fields", () => {
    const amenity = { id: "wifi", label: "Free Wi-Fi", iconName: "wifi", createdAt: new Date(), updatedAt: new Date() };

    assert.deepEqual(toHotelSummary(hotel({ amenities: [amenity] })).amenities, [
      { id: "wifi", label: "Free Wi-Fi", iconName: "wifi" },
    ]);
  });
});

describe("featuredRoom", () => {
  const featured = (rooms) => toHotelSummary(hotel({ rooms })).featuredRoom;

  it("is the cheapest room", () => {
    const rooms = [room({ name: "Suite", pricePerNight: decimal("300") }), room({ name: "Twin", beds: "2 beds", pricePerNight: decimal("99") })];

    assert.deepEqual(featured(rooms), { name: "Twin", beds: "2 beds" });
  });

  it("compares prices as numbers, not text", () => {
    const rooms = [room({ name: "Suite", pricePerNight: decimal("1000") }), room({ name: "Twin", pricePerNight: decimal("99") })];

    assert.equal(featured(rooms).name, "Twin");
  });

  it("skips rooms that aren't available", () => {
    const rooms = [room({ name: "Sold out", pricePerNight: decimal("50"), isAvailable: false }), room({ name: "Open", pricePerNight: decimal("99") })];

    assert.equal(featured(rooms).name, "Open");
  });

  it("falls back to the cheapest room when none are available", () => {
    const rooms = [room({ name: "Suite", pricePerNight: decimal("300"), isAvailable: false }), room({ name: "Twin", pricePerNight: decimal("99"), isAvailable: false })];

    assert.equal(featured(rooms).name, "Twin");
  });

  it("stays safe for a hotel with no rooms", () => {
    assert.deepEqual(featured([]), { name: "", beds: "" });
  });

  it("doesn't change the order of the rooms", () => {
    const rooms = [room({ id: "a", pricePerNight: decimal("300") }), room({ id: "b", pricePerNight: decimal("99") })];

    assert.deepEqual(
      toHotelDetails(hotel({ rooms })).rooms.map(({ id }) => id),
      ["a", "b"],
    );
  });

  it("doesn't change the order when every room is sold out", () => {
    const rooms = [
      room({ id: "a", pricePerNight: decimal("300"), isAvailable: false }),
      room({ id: "b", pricePerNight: decimal("99"), isAvailable: false }),
    ];

    assert.deepEqual(
      toHotelDetails(hotel({ rooms })).rooms.map(({ id }) => id),
      ["a", "b"],
    );
  });
});

describe("toHotelDetails", () => {
  const review = {
    id: "review",
    hotelId: "hotel",
    userId: "user",
    bookingId: "booking",
    author: "Amara O.",
    country: "Nigeria",
    score: 9.2,
    stayDate: "October 2026",
    title: "Lovely stay",
    text: "Spotless.",
    photos: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("returns the keys of HotelDetails", () => {
    assert.deepEqual(sortedKeys(toHotelDetails(hotel())), [...DETAILS_KEYS, "originalPrice"].sort());
  });

  it("returns rooms with only the HotelRoom keys", () => {
    const [mapped] = toHotelDetails(hotel()).rooms;

    assert.deepEqual(Object.keys(mapped).sort(), [...ROOM_KEYS].sort());
    assert.equal(mapped.pricePerNight, "189.00");
  });

  it("keeps a sold out room in the list", () => {
    const rooms = [room({ isAvailable: false })];

    assert.equal(toHotelDetails(hotel({ rooms })).rooms[0].isAvailable, false);
  });

  it("returns reviews with only the HotelReview keys, so user and booking ids stay private", () => {
    const [mapped] = toHotelDetails(hotel({ reviews: [review] })).reviews;

    assert.deepEqual(Object.keys(mapped).sort(), [...REVIEW_KEYS].sort());
  });
});

describe("with seeded data", () => {
  const withNumberPrices = (value) => {
    const result = { ...value, pricePerNight: Number(value.pricePerNight) };

    if ("originalPrice" in value) result.originalPrice = Number(value.originalPrice);
    if (value.rooms) result.rooms = value.rooms.map(withNumberPrices);

    return result;
  };

  let rows;
  let log;

  before(async () => {
    log = console.log;
    console.log = () => {};

    await resetDatabase();
    await seedHotels();

    rows = await prisma.hotel.findMany({
      include: {
        amenities: true,
        rooms: { orderBy: { id: "asc" } },
        reviews: { orderBy: { id: "asc" } },
      },
      orderBy: { sortRank: "asc" },
    });
  });

  after(async () => {
    console.log = log;
    await closeDatabase();
  });

  it("reproduces every sample hotel, except price formatting", () => {
    assert.equal(rows.length, samples.length);

    rows.forEach((row, index) => {
      const sample = structuredClone(samples[index]);

      sample.rooms.sort((a, b) => a.id.localeCompare(b.id));
      sample.reviews.sort((a, b) => a.id.localeCompare(b.id));
      sample.amenities.sort((a, b) => a.id.localeCompare(b.id));

      const mapped = toJson(toHotelDetails(row));

      mapped.amenities.sort((a, b) => a.id.localeCompare(b.id));

      for (const item of [...sample.reviews, ...mapped.reviews]) {
        for (const key of Object.keys(item)) if (!REVIEW_KEYS.includes(key)) delete item[key];
      }

      assert.deepEqual(withNumberPrices(mapped), withNumberPrices(sample), sample.slug);
    });
  });

  it("gives the same featured room as the sample data", () => {
    rows.forEach((row, index) => {
      assert.deepEqual(toHotelSummary(row).featuredRoom, samples[index].featuredRoom, samples[index].slug);
    });
  });
});
