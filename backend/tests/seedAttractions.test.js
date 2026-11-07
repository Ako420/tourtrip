import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, beforeEach, describe, it } from "node:test";
import { seedAttractions } from "../prisma/seed-attractions.js";
import { seedHotels } from "../prisma/seed-hotels.js";
import { cloudinary } from "../src/config/cloudinary.js";
import { prisma } from "../src/config/db.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/attractions.json", import.meta.url), "utf8"));
const hotels = JSON.parse(readFileSync(new URL("../prisma/seed-data/hotels.json", import.meta.url), "utf8"));
const iconsFile = readFileSync(new URL("../../frontend/src/constants/icons.ts", import.meta.url), "utf8");

const sampleTickets = samples.flatMap(({ tickets }) => tickets);
const sampleReviews = samples.flatMap(({ reviews }) => reviews);

const [sample] = samples;

const countRows = async () => ({
  attractions: await prisma.attraction.count(),
  tickets: await prisma.ticketOption.count(),
  reviews: await prisma.review.count(),
});

const expectedCounts = { attractions: samples.length, tickets: sampleTickets.length, reviews: sampleReviews.length };

const getTicket = (attractionId, name) => {
  return prisma.ticketOption.findUnique({ where: { attractionId_name: { attractionId, name } } });
};

const iconNames = (value, field) => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => iconNames(item, field));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) => iconNames(item, key));
  }

  return field === "iconName" ? [value] : [];
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

describe("seedAttractions", () => {
  it("creates every attraction, ticket and review", async () => {
    await seedAttractions();

    assert.deepEqual(await countRows(), expectedCounts);
    assert.deepEqual(expectedCounts, { attractions: 16, tickets: 48, reviews: 80 });
  });

  it("creates no duplicates when run twice", async () => {
    await seedAttractions();
    await seedAttractions();

    assert.deepEqual(await countRows(), expectedCounts);
  });

  it("keeps each attraction's details", async () => {
    await seedAttractions();

    for (const item of samples) {
      const attraction = await prisma.attraction.findUnique({ where: { id: item.id } });

      for (const field of ["slug", "name", "city", "country", "category", "duration", "currency", "description", "address", "freeCancellation"]) {
        assert.equal(attraction[field], item[field]);
      }

      assert.deepEqual(attraction.highlights, item.highlights);
      assert.deepEqual(attraction.reviewScores, item.reviewScores);
      assert.deepEqual(attraction.policies, item.policies);
      assert.deepEqual(attraction.nearby, item.nearby);
    }
  });

  it("keeps the sample's rating out of 5 and its review count", async () => {
    await seedAttractions();

    for (const { id, rating, reviewCount } of samples) {
      const attraction = await prisma.attraction.findUnique({ where: { id } });

      assert.equal(attraction.rating, rating);
      assert.equal(attraction.reviewCount, reviewCount);
      assert.ok(attraction.rating <= 5);
    }
  });

  it("uses the standard ticket's adult price", async () => {
    await seedAttractions();

    for (const { id, tickets } of samples) {
      const attraction = await prisma.attraction.findUnique({ where: { id } });
      const standard = tickets.find((ticket) => ticket.id === "standard");

      assert.equal(attraction.price.toNumber(), standard.adultPrice);
    }
  });

  it("keeps the sample order in sortRank", async () => {
    await seedAttractions();

    const attractions = await prisma.attraction.findMany({ orderBy: { sortRank: "asc" } });

    assert.deepEqual(attractions.map(({ id }) => id), samples.map(({ id }) => id));
    assert.deepEqual(attractions.map(({ sortRank }) => sortRank), samples.map((_, index) => index + 1));
  });

  it("uploads nothing during tests", async (t) => {
    const upload = t.mock.method(cloudinary.uploader, "upload", async () => ({ secure_url: "unused" }));

    await seedAttractions();

    assert.equal(upload.mock.callCount(), 0);
  });
});

describe("seedAttractions tickets", () => {
  it("keeps each ticket's details", async () => {
    await seedAttractions();

    for (const { id, tickets } of samples) {
      for (const { name, description, includes, adultPrice, childPrice } of tickets) {
        const ticket = await getTicket(id, name);

        assert.equal(ticket.description, description);
        assert.deepEqual(ticket.includes, includes);
        assert.equal(ticket.adultPrice.toNumber(), adultPrice);
        assert.equal(ticket.childPrice.toNumber(), childPrice);
      }
    }
  });

  it("lets the database create ids, because the sample's repeat", async () => {
    await seedAttractions();

    const tickets = await prisma.ticketOption.findMany({ select: { id: true } });

    assert.equal(new Set(tickets.map(({ id }) => id)).size, sampleTickets.length);
    assert.ok(tickets.every(({ id }) => !["standard", "guided", "private"].includes(id)));
  });

  it("starts each ticket with a daily limit of 200", async () => {
    await seedAttractions();

    assert.equal(await prisma.ticketOption.count({ where: { dailyLimit: 200 } }), sampleTickets.length);
  });

  it("keeps ticket ids when run twice, because bookings will point at them", async () => {
    await seedAttractions();

    const first = await getTicket(sample.id, sample.tickets[0].name);

    await seedAttractions();

    assert.equal((await getTicket(sample.id, sample.tickets[0].name)).id, first.id);
  });

  it("keeps a changed daily limit, which a seed shouldn't undo", async () => {
    await seedAttractions();

    const { id } = await getTicket(sample.id, sample.tickets[0].name);

    await prisma.ticketOption.update({ where: { id }, data: { dailyLimit: 50 } });
    await seedAttractions();

    assert.equal((await prisma.ticketOption.findUnique({ where: { id } })).dailyLimit, 50);
  });

  it("puts a changed price back", async () => {
    await seedAttractions();

    const { id } = await getTicket(sample.id, sample.tickets[0].name);

    await prisma.ticketOption.update({ where: { id }, data: { adultPrice: "1.00" } });
    await seedAttractions();

    assert.equal((await prisma.ticketOption.findUnique({ where: { id } })).adultPrice.toNumber(), sample.tickets[0].adultPrice);
  });
});

describe("seedAttractions reviews", () => {
  it("links each review to its attraction and no hotel", async () => {
    await seedAttractions();

    for (const { id, reviews } of samples) {
      const found = await prisma.review.findMany({ where: { attractionId: id } });

      assert.equal(found.length, reviews.length);
      assert.ok(found.every(({ hotelId }) => hotelId === null));
    }
  });

  it("keeps each review's details", async () => {
    await seedAttractions();

    for (const { id, author, country, score, stayDate, title, text } of sampleReviews) {
      const review = await prisma.review.findUnique({ where: { id } });

      assert.deepEqual(
        [review.author, review.country, review.score, review.stayDate, review.title, review.text],
        [author, country, score, stayDate, title, text],
      );
    }
  });

  it("dates each review by the visit", async () => {
    await seedAttractions();

    const [{ id, stayDate }] = sample.reviews;
    const review = await prisma.review.findUnique({ where: { id } });

    assert.equal(review.createdAt.toISOString().slice(0, 10), new Date(`1 ${stayDate} UTC`).toISOString().slice(0, 10));
  });

  it("dates reviews that were already there", async () => {
    await seedAttractions();

    const [{ id }] = sample.reviews;
    const seeded = await prisma.review.findUnique({ where: { id } });

    await prisma.review.update({ where: { id }, data: { createdAt: new Date() } });
    await seedAttractions();

    assert.deepEqual((await prisma.review.findUnique({ where: { id } })).createdAt, seeded.createdAt);
  });

  it("leaves hotel reviews alone, in the shared table", async () => {
    const hotelReviews = hotels.flatMap(({ reviews }) => reviews).length;

    await seedHotels();
    await seedAttractions();

    assert.equal(await prisma.review.count(), hotelReviews + sampleReviews.length);
    assert.equal(await prisma.review.count({ where: { hotelId: { not: null } } }), hotelReviews);
    assert.equal(await prisma.review.count({ where: { attractionId: { not: null } } }), sampleReviews.length);
  });

  it("uses review ids no hotel has", () => {
    const hotelIds = new Set(hotels.flatMap(({ reviews }) => reviews.map(({ id }) => id)));

    assert.ok(sampleReviews.every(({ id }) => !hotelIds.has(id)));
  });
});

describe("seedAttractions again", () => {
  it("puts a changed attraction back", async () => {
    await seedAttractions();
    await prisma.attraction.update({ where: { id: sample.id }, data: { name: "Changed", sortRank: 99, price: "1.00" } });
    await seedAttractions();

    const attraction = await prisma.attraction.findUnique({ where: { id: sample.id } });

    assert.equal(attraction.name, sample.name);
    assert.equal(attraction.sortRank, 1);
    assert.equal(attraction.price.toNumber(), sample.price);
  });

  it("puts a changed review back", async () => {
    await seedAttractions();

    const [{ id, title }] = sample.reviews;

    await prisma.review.update({ where: { id }, data: { title: "Changed" } });
    await seedAttractions();

    assert.equal((await prisma.review.findUnique({ where: { id } })).title, title);
  });

  it("leaves rows it didn't create alone", async () => {
    await seedAttractions();

    const review = await prisma.review.create({
      data: {
        attractionId: sample.id,
        author: "Real Guest",
        country: "Ghana",
        score: 5,
        stayDate: "November 2026",
        title: "Nice",
        text: "A real review.",
      },
    });

    await seedAttractions();

    assert.equal(await prisma.review.count({ where: { id: review.id } }), 1);
  });
});

describe("attractions.json", () => {
  it("uses only icons the frontend has", () => {
    const names = new Set(iconNames(samples));

    assert.ok(names.size > 0);

    for (const name of names) {
      assert.match(iconsFile, new RegExp(`^\\s*"?${name}"?\\s*[:,]`, "m"), `${name} isn't in icons.ts`);
    }
  });

  it("has a standard ticket on every attraction", () => {
    assert.ok(samples.every(({ tickets }) => tickets.some(({ id }) => id === "standard")));
  });

  it("uses only known categories", () => {
    assert.ok(samples.every(({ category }) => ["landmarks", "nature", "adventure", "city"].includes(category)));
  });
});
