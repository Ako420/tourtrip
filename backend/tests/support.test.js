import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedFaqs } from "../prisma/seed-faqs.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/faqs.json", import.meta.url), "utf8"));

const FAQ_KEYS = ["answer", "id", "product", "question"];

const getFaqs = () => api.get("/api/support/faqs");

const ids = (response) => response.body.map(({ id }) => id);

const addFaq = (id, sortRank) => {
  return prisma.faq.create({ data: { id, product: "account", question: "Question?", answer: "Answer.", sortRank } });
};

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedFaqs();
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/support/faqs", () => {
  it("returns every FAQ, matching the sample data in its order", async () => {
    const response = await getFaqs();

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, samples);
  });

  it("returns only the SupportFaq fields", async () => {
    const response = await getFaqs();

    for (const faq of response.body) {
      assert.deepEqual(Object.keys(faq).sort(), FAQ_KEYS);
    }
  });

  it("needs no sign-in", async () => {
    const response = await getFaqs().set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });

  it("orders by rank, not by when a FAQ was added", async () => {
    await addFaq("first-by-rank", -1);

    const response = await getFaqs();

    await prisma.faq.delete({ where: { id: "first-by-rank" } });

    assert.equal(ids(response)[0], "first-by-rank");
  });

  it("settles a rank tie by id", async () => {
    // Shuffled, because with no tie-break the database returns ties in the order it finds them.
    for (const id of ["tie-d", "tie-g", "tie-a", "tie-f", "tie-c", "tie-b", "tie-e"]) {
      await addFaq(id, 100);
    }

    const response = await getFaqs();

    await prisma.faq.deleteMany({ where: { id: { startsWith: "tie-" } } });

    assert.deepEqual(ids(response).slice(samples.length), ["tie-a", "tie-b", "tie-c", "tie-d", "tie-e", "tie-f", "tie-g"]);
  });

  it("returns an empty list when there are none", async () => {
    await resetDatabase();

    const response = await getFaqs();

    await seedFaqs();

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  it("only answers GET", async () => {
    const response = await api.post("/api/support/faqs").send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});

describe("seedFaqs", () => {
  it("has the 16 entries from the frontend", () => {
    assert.equal(samples.length, 16);
    assert.equal(new Set(samples.map(({ id }) => id)).size, 16);
  });

  it("uses only the products the frontend knows", () => {
    const products = new Set(["flights", "hotels", "trains", "cars", "attractions", "account"]);

    assert.ok(samples.every(({ product }) => products.has(product)));
  });

  it("keeps each sample's id and order", async () => {
    const faqs = await prisma.faq.findMany({ orderBy: { sortRank: "asc" } });

    assert.deepEqual(faqs.map(({ id }) => id), samples.map(({ id }) => id));
    assert.deepEqual(faqs.map(({ sortRank }) => sortRank), samples.map((_, index) => index + 1));
  });

  it("creates no duplicates when run twice", async () => {
    await seedFaqs();

    assert.equal(await prisma.faq.count(), samples.length);
  });

  it("puts a changed FAQ back to the sample", async () => {
    const [{ id, answer }] = samples;

    await prisma.faq.update({ where: { id }, data: { answer: "Changed.", sortRank: 99 } });
    await seedFaqs();

    const faq = await prisma.faq.findUnique({ where: { id } });

    assert.equal(faq.answer, answer);
    assert.equal(faq.sortRank, 1);
  });

  it("leaves other FAQs alone", async () => {
    await addFaq("added-later", 50);
    await seedFaqs();

    const count = await prisma.faq.count({ where: { id: "added-later" } });

    await prisma.faq.delete({ where: { id: "added-later" } });

    assert.equal(count, 1);
  });
});
