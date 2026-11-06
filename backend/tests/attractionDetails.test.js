import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedAttractions } from "../prisma/seed-attractions.js";
import { seedContent } from "../prisma/seed-content.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/attractions.json", import.meta.url), "utf8"));
const content = JSON.parse(readFileSync(new URL("../prisma/seed-data/content.json", import.meta.url), "utf8"));
const typesFile = readFileSync(new URL("../../frontend/src/types/attraction.ts", import.meta.url), "utf8");

const getTypeKeys = (name) => {
  const [, body] = typesFile.match(new RegExp(`export type ${name} = (?:\\w+ & )?\\{\\n([\\s\\S]*?)\\n\\};`));

  return [...body.matchAll(/^ {2}(\w+)\??:/gm)].map(([, key]) => key);
};

const DETAILS_KEYS = [...getTypeKeys("Attraction"), ...getTypeKeys("AttractionDetails")].sort();
const TICKET_KEYS = getTypeKeys("TicketOption").sort();

const [sample] = samples;

const getAttraction = (slug) => api.get(`/api/attractions/${slug}`);

const ticketFields = { description: "Entry.", includes: [], adultPrice: "10.00", childPrice: "5.00" };

const reviewFields = { author: "Guest", country: "Kenya", score: 4, stayDate: "May 2026", title: "Nice", text: "Lovely." };

const addAttraction = (slug) => {
  const { id, tickets, reviews, ...data } = sample;

  return prisma.attraction.create({ data: { ...data, id: slug, slug } });
};

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedAttractions();
  await seedContent();
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/attractions/:slug", () => {
  it("returns exactly the keys of AttractionDetails", async () => {
    const response = await getAttraction(sample.slug);

    assert.equal(response.status, 200);
    assert.deepEqual(Object.keys(response.body).sort(), DETAILS_KEYS);
  });

  for (const item of samples) {
    it(`returns the details of ${item.slug}`, async () => {
      const { body } = await getAttraction(item.slug);

      for (const field of ["id", "slug", "name", "city", "country", "category", "rating", "reviewCount", "duration", "currency", "description", "address", "freeCancellation"]) {
        assert.equal(body[field], item[field]);
      }

      assert.equal(Number(body.price), Number(item.price));
      assert.deepEqual(body.highlights, item.highlights);
      assert.deepEqual(body.reviewScores, item.reviewScores);
      assert.deepEqual(body.policies, item.policies);
      assert.deepEqual(body.nearby, item.nearby);
    });
  }

  it("sends prices as money text", async () => {
    const { body } = await getAttraction(sample.slug);

    assert.match(body.price, /^\d+\.\d{2}$/);
    assert.match(body.tickets[0].adultPrice, /^\d+\.\d{2}$/);
    assert.match(body.tickets[0].childPrice, /^\d+\.\d{2}$/);
  });

  it("ignores anything else in the query", async () => {
    const response = await api.get(`/api/attractions/${sample.slug}?date=2026-12-10`);

    assert.equal(response.status, 200);
  });

  it("needs no sign-in", async () => {
    const response = await getAttraction(sample.slug).set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });
});

describe("GET /api/attractions/:slug tickets", () => {
  it("returns only the TicketOption keys, hiding the daily limit", async () => {
    const { body } = await getAttraction(sample.slug);

    for (const ticket of body.tickets) {
      assert.deepEqual(Object.keys(ticket).sort(), TICKET_KEYS);
    }
  });

  it("lists every attraction's tickets, cheapest first, as the samples do", async () => {
    for (const item of samples) {
      const { body } = await getAttraction(item.slug);

      assert.deepEqual(body.tickets.map(({ name }) => name), item.tickets.map(({ name }) => name));
    }
  });

  it("uses real ticket ids, because a booking has to name one", async () => {
    const { body } = await getAttraction(sample.slug);
    const stored = await prisma.ticketOption.findMany({ where: { attractionId: sample.id } });

    assert.deepEqual(body.tickets.map(({ id }) => id).sort(), stored.map(({ id }) => id).sort());
  });

  it("sorts by price, not by name or when it was added", async () => {
    const { id } = await addAttraction("ticket-prices");

    await prisma.ticketOption.create({ data: { ...ticketFields, attractionId: id, name: "A dear ticket", adultPrice: "90.00" } });
    await prisma.ticketOption.create({ data: { ...ticketFields, attractionId: id, name: "Z cheap ticket", adultPrice: "9.00" } });

    const { body } = await getAttraction("ticket-prices");

    await prisma.attraction.delete({ where: { id } });

    assert.deepEqual(body.tickets.map(({ name }) => name), ["Z cheap ticket", "A dear ticket"]);
  });

  it("compares prices as money, not text", async () => {
    const { id } = await addAttraction("ticket-money");

    await prisma.ticketOption.create({ data: { ...ticketFields, attractionId: id, name: "Hundred", adultPrice: "100.00" } });
    await prisma.ticketOption.create({ data: { ...ticketFields, attractionId: id, name: "Nine", adultPrice: "9.00" } });

    const { body } = await getAttraction("ticket-money");

    await prisma.attraction.delete({ where: { id } });

    assert.deepEqual(body.tickets.map(({ name }) => name), ["Nine", "Hundred"]);
  });

  it("settles a price tie by name", async () => {
    const { id } = await addAttraction("ticket-ties");

    for (const name of ["Dawn", "Gold", "Aqua", "Fern", "Coal", "Blue", "Echo"]) {
      await prisma.ticketOption.create({ data: { ...ticketFields, attractionId: id, name } });
    }

    const { body } = await getAttraction("ticket-ties");

    await prisma.attraction.delete({ where: { id } });

    assert.deepEqual(body.tickets.map(({ name }) => name), ["Aqua", "Blue", "Coal", "Dawn", "Echo", "Fern", "Gold"]);
  });
});

describe("GET /api/attractions/:slug reviews", () => {
  it("shows the latest visit first", async () => {
    for (const item of samples) {
      const { body } = await getAttraction(item.slug);
      const dates = body.reviews.map(({ stayDate }) => new Date(stayDate).getTime());

      assert.equal(body.reviews.length, item.reviews.length);
      assert.deepEqual(dates, dates.toSorted((a, b) => b - a));
    }
  });

  it("returns only the latest 5", async () => {
    const { id } = await addAttraction("review-limit");
    const dates = ["2026-01-01", "2026-06-01", "2026-03-01", "2026-05-01", "2026-02-01", "2026-04-01", "2026-07-01"];

    for (const date of dates) {
      await prisma.review.create({ data: { ...reviewFields, attractionId: id, title: date, createdAt: new Date(date) } });
    }

    const { body } = await getAttraction("review-limit");

    await prisma.attraction.delete({ where: { id } });

    assert.deepEqual(
      body.reviews.map(({ title }) => title),
      ["2026-07-01", "2026-06-01", "2026-05-01", "2026-04-01", "2026-03-01"],
    );
  });

  it("settles a date tie by id, including which reviews make the 5", async () => {
    const { id } = await addAttraction("review-ties");
    const createdAt = new Date("2026-01-01");

    // Shuffled, because with no tie-break the database returns ties in reverse order of insertion.
    for (const letter of ["d", "g", "a", "f", "c", "b", "e"]) {
      await prisma.review.create({ data: { ...reviewFields, id: `review-${letter}`, attractionId: id, createdAt } });
    }

    const { body } = await getAttraction("review-ties");

    await prisma.attraction.delete({ where: { id } });

    assert.deepEqual(body.reviews.map((review) => review.id), ["review-g", "review-f", "review-e", "review-d", "review-c"]);
  });

  it("shows only this attraction's reviews", async () => {
    const { body } = await getAttraction(sample.slug);

    assert.deepEqual(body.reviews.map(({ id }) => id).sort(), sample.reviews.map(({ id }) => id).sort());
  });

  it("returns empty lists for an attraction with no tickets or reviews", async () => {
    const { id } = await addAttraction("bare-attraction");
    const response = await getAttraction("bare-attraction");

    await prisma.attraction.delete({ where: { id } });

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.tickets, []);
    assert.deepEqual(response.body.reviews, []);
  });
});

describe("GET /api/attractions/:slug unknown slugs", () => {
  const unknown = {
    "an unknown slug": "no-such-attraction",
    "a slug in another letter case": sample.slug.toUpperCase(),
    "part of a slug": sample.slug.slice(0, 4),
    "an attraction's id": sample.id,
    "a wildcard": "%25",
    "a space": "%20",
    "a very long slug": "x".repeat(2000),
  };

  for (const [name, slug] of Object.entries(unknown)) {
    it(`returns 404 for ${name}`, async () => {
      const response = await getAttraction(slug);

      assert.equal(response.status, 404);
      assert.deepEqual(response.body, { message: "Attraction not found", code: "ATTRACTION_NOT_FOUND" });
    });
  }

  it("rejects a null byte", async () => {
    const response = await getAttraction("%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("rejects a slug that can't be decoded", async () => {
    const response = await getAttraction("%E0%A4%A");

    assert.equal(response.status, 400);
  });
});

describe("GET /api/attractions routes", () => {
  it("doesn't treat search as a slug", async () => {
    const response = await api.get("/api/attractions/search");

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.items));
  });

  it("doesn't treat content as a slug", async () => {
    const response = await api.get("/api/attractions/content");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, content.attractions);
  });
});
