import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedAttractions } from "../prisma/seed-attractions.js";
import { seedContent } from "../prisma/seed-content.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/attractions.json", import.meta.url), "utf8"));
const content = JSON.parse(readFileSync(new URL("../prisma/seed-data/content.json", import.meta.url), "utf8"));
const typesFile = readFileSync(new URL("../../frontend/src/types/planner.ts", import.meta.url), "utf8");

const [, plannerType] = typesFile.match(/export type PlannerSuggestion = \{\n([\s\S]*?)\n\};/);
const SUGGESTION_KEYS = [...plannerType.matchAll(/^ {2}(\w+)\??:/gm)].map(([, key]) => key).sort();

const getSuggestions = () => api.get("/api/planner/suggestions");

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

describe("GET /api/planner/suggestions", () => {
  it("returns every attraction, in the sample order", async () => {
    const response = await getSuggestions();

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.map(({ slug }) => slug), samples.map(({ slug }) => slug));
  });

  it("returns exactly the keys of PlannerSuggestion", async () => {
    const { body } = await getSuggestions();

    for (const suggestion of body) {
      assert.deepEqual(Object.keys(suggestion).sort(), SUGGESTION_KEYS);
    }
  });

  it("sends the price as a number, which the planner adds up", async () => {
    const { body } = await getSuggestions();

    for (const suggestion of body) {
      assert.equal(typeof suggestion.price, "number");
    }
  });

  it("matches the sample's fields", async () => {
    const { body } = await getSuggestions();

    for (const [index, sample] of samples.entries()) {
      const { id, slug, name, city, country, imageUrl, duration, price, currency } = sample;

      assert.deepEqual(body[index], { id, slug, name, city, country, imageUrl, duration, price, currency });
    }
  });

  it("keeps the cents in a price", async () => {
    const [{ id }] = samples;

    await prisma.attraction.update({ where: { id }, data: { price: "25.55" } });

    const { body } = await getSuggestions();

    await seedAttractions();

    assert.equal(body[0].price, 25.55);
  });

  it("orders by rank, then id", async () => {
    const { id, tickets, reviews, ...data } = samples[0];

    for (const slug of ["tie-d", "tie-g", "tie-a", "tie-f", "tie-c", "tie-b", "tie-e"]) {
      await prisma.attraction.create({ data: { ...data, id: slug, slug, sortRank: -1 } });
    }

    const { body } = await getSuggestions();

    await prisma.attraction.deleteMany({ where: { sortRank: -1 } });

    assert.deepEqual(body.slice(0, 7).map(({ slug }) => slug), ["tie-a", "tie-b", "tie-c", "tie-d", "tie-e", "tie-f", "tie-g"]);
  });

  it("needs no sign-in", async () => {
    const response = await getSuggestions().set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });

  it("ignores anything in the query", async () => {
    const response = await api.get("/api/planner/suggestions?page=2&city=Rome");

    assert.equal(response.body.length, samples.length);
  });

  it("leaves the planner's page content where it was", async () => {
    const response = await api.get("/api/planner/content");

    assert.deepEqual(response.body, content.planner);
  });

  it("only answers GET", async () => {
    const response = await api.post("/api/planner/suggestions").send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });

  it("returns an empty list when there are no attractions", async () => {
    await prisma.attraction.deleteMany();

    const response = await getSuggestions();

    await seedAttractions();

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });
});
