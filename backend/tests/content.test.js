import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedContent } from "../prisma/seed-content.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/content.json", import.meta.url), "utf8"));

const PAGES = {
  "/api/home": "home",
  "/api/hotels/content": "hotels",
  "/api/flights/content": "flights",
  "/api/attractions/content": "attractions",
  "/api/cars/content": "cars",
  "/api/trains/content": "trains",
  "/api/packages/content": "packages",
  "/api/planner/content": "planner",
  "/api/app/content": "app",
  "/api/legal/terms": "legal-terms",
  "/api/legal/privacy": "legal-privacy",
};

const assertNotFound = (response) => {
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { message: "Content not found", code: "CONTENT_NOT_FOUND" });
};

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedContent();
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("page content", () => {
  for (const [path, key] of Object.entries(PAGES)) {
    it(`returns the ${key} block at ${path}`, async () => {
      const response = await api.get(path);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body, samples[key]);
    });
  }

  it("returns a block on its own, with no wrapper", async () => {
    const response = await api.get("/api/planner/content");

    assert.deepEqual(Object.keys(response.body).sort(), Object.keys(samples.planner).sort());
  });

  it("needs no sign-in", async () => {
    const response = await api.get("/api/home").set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });

  it("shows a change on the next request", async () => {
    await prisma.contentBlock.update({ where: { key: "app" }, data: { data: { changed: true } } });

    const response = await api.get("/api/app/content");

    await prisma.contentBlock.update({ where: { key: "app" }, data: { data: samples.app } });

    assert.deepEqual(response.body, { changed: true });
  });

  it("keeps a legal document marked as a draft", async () => {
    const response = await api.get("/api/legal/terms");

    assert.equal(response.body.isDraft, true);
  });

  it("doesn't take over the routes around it", async () => {
    const hotels = await api.get("/api/hotels");
    const unknown = await api.get("/api/flights/nothing");

    assert.equal(hotels.status, 200);
    assert.equal(unknown.status, 404);
    assert.equal(unknown.body.code, "ROUTE_NOT_FOUND");
  });

  it("only answers GET", async () => {
    const response = await api.post("/api/home").send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});

describe("GET /api/legal/:slug unknown slugs", () => {
  const slugs = ["cookies", "TERMS", "legal-terms", "home", "constructor", "__proto__", "toString", "%20"];

  for (const slug of slugs) {
    it(`returns 404 for ${slug}`, async () => {
      assertNotFound(await api.get(`/api/legal/${slug}`));
    });
  }

  it("doesn't serve another block with a legal- key", async () => {
    await prisma.contentBlock.create({ data: { key: "legal-cookies", data: { secret: true } } });

    const response = await api.get("/api/legal/cookies");

    await prisma.contentBlock.delete({ where: { key: "legal-cookies" } });

    assertNotFound(response);
  });

  it("rejects a null byte", async () => {
    const response = await api.get("/api/legal/%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });
});

// Last, because it clears the blocks the tests above use.
describe("content that hasn't been seeded", () => {
  before(resetDatabase);

  for (const path of Object.keys(PAGES)) {
    it(`returns 404 at ${path}`, async () => {
      assertNotFound(await api.get(path));
    });
  }
});
