import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedAttractions } from "../prisma/seed-attractions.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/attractions.json", import.meta.url), "utf8"));
const typesFile = readFileSync(new URL("../../frontend/src/types/attraction.ts", import.meta.url), "utf8");

const SIMILAR = 6;

const [, attractionType] = typesFile.match(/export type Attraction = \{\n([\s\S]*?)\n\};/);
const ATTRACTION_KEYS = [...attractionType.matchAll(/^ {2}(\w+)\??:/gm)].map(([, key]) => key).sort();

const getSimilar = (slug) => api.get(`/api/attractions/${slug}/similar`);

const slugs = ({ body }) => body.map(({ slug }) => slug);

const addAttraction = (slug, changes = {}) => {
  const { id, tickets, reviews, ...data } = samples[0];

  return prisma.attraction.create({ data: { ...data, id: slug, slug, ...changes } });
};

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedAttractions();
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/attractions/:slug/similar", () => {
  for (const sample of samples) {
    it(`matches the frontend's sample for ${sample.slug}`, async () => {
      const expected = samples
        .filter(({ slug }) => slug !== sample.slug)
        .toSorted((a, b) => Number(b.category === sample.category) - Number(a.category === sample.category))
        .slice(0, SIMILAR);

      const response = await getSimilar(sample.slug);

      assert.equal(response.status, 200);
      assert.deepEqual(slugs(response), expected.map(({ slug }) => slug));
    });
  }

  it("returns exactly the keys of Attraction, with money text", async () => {
    const { body } = await getSimilar(samples[0].slug);

    for (const attraction of body) {
      assert.deepEqual(Object.keys(attraction).sort(), ATTRACTION_KEYS);
      assert.match(attraction.price, /^\d+\.\d{2}$/);
    }
  });

  it("never includes the attraction itself", async () => {
    for (const { slug } of samples) {
      assert.ok(!slugs(await getSimilar(slug)).includes(slug));
    }
  });

  it("returns 6 or fewer", async () => {
    for (const { slug } of samples) {
      assert.ok((await getSimilar(slug)).body.length <= SIMILAR);
    }
  });

  it("lists same-category items first", async () => {
    for (const { slug, category } of samples) {
      const categories = (await getSimilar(slug)).body.map((item) => item.category === category);

      assert.deepEqual(categories, categories.toSorted((a, b) => Number(b) - Number(a)));
    }
  });

  it("needs no sign-in", async () => {
    const response = await getSimilar(samples[0].slug).set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });
});

describe("GET /api/attractions/:slug/similar when a category is large", () => {
  before(async () => {
    await addAttraction("large-target", { category: "city", sortRank: 900 });

    for (const [index, slug] of ["large-g", "large-b", "large-e", "large-a", "large-f", "large-c", "large-d"].entries()) {
      await addAttraction(slug, { category: "city", sortRank: -100 + index });
    }
  });

  after(() => prisma.attraction.deleteMany({ where: { slug: { startsWith: "large-" } } }));

  it("stops at 6, all from the same category, by rank", async () => {
    const response = await getSimilar("large-target");

    assert.deepEqual(slugs(response), ["large-g", "large-b", "large-e", "large-a", "large-f", "large-c"]);
  });
});

describe("GET /api/attractions/:slug/similar ties", () => {
  before(async () => {
    await addAttraction("tie-target", { category: "adventure", sortRank: -300 });

    for (const slug of ["tie-d", "tie-g", "tie-a", "tie-f", "tie-c", "tie-b", "tie-e"]) {
      await addAttraction(slug, { category: "adventure", sortRank: -200 });
    }
  });

  after(() => prisma.attraction.deleteMany({ where: { slug: { startsWith: "tie-" } } }));

  it("settles a rank tie by id, including which ones make the 6", async () => {
    const response = await getSimilar("tie-target");

    assert.deepEqual(slugs(response), ["tie-a", "tie-b", "tie-c", "tie-d", "tie-e", "tie-f"]);
  });
});

describe("GET /api/attractions/:slug/similar unknown slugs", () => {
  it("returns 404 for an unknown slug", async () => {
    const response = await getSimilar("no-such-attraction");

    assert.equal(response.status, 404);
    assert.deepEqual(response.body, { message: "Attraction not found", code: "ATTRACTION_NOT_FOUND" });
  });

  it("rejects a null byte", async () => {
    const response = await getSimilar("%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("only answers GET", async () => {
    const response = await api.post(`/api/attractions/${samples[0].slug}/similar`).send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});

// Last, because it clears the attractions the tests above use.
describe("GET /api/attractions/:slug/similar with few attractions", () => {
  before(resetDatabase);

  it("returns an empty list when there's no other attraction", async () => {
    await addAttraction("only-one");

    const response = await getSimilar("only-one");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  it("returns what there is when there are fewer than six", async () => {
    await addAttraction("other-category", { category: "nature" });
    await addAttraction("same-category", { category: "landmarks" });

    const response = await getSimilar("only-one");

    assert.equal(samples[0].category, "landmarks");
    assert.deepEqual(slugs(response), ["same-category", "other-category"]);
  });
});
