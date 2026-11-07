import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { seedAttractions } from "../prisma/seed-attractions.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/attractions.json", import.meta.url), "utf8"));
const typesFile = readFileSync(new URL("../../frontend/src/types/attraction.ts", import.meta.url), "utf8");

const PAGE_SIZE = 8;

const [, attractionType] = typesFile.match(/export type Attraction = \{\n([\s\S]*?)\n\};/);
const ATTRACTION_KEYS = [...attractionType.matchAll(/^ {2}(\w+)\??:/gm)].map(([, key]) => key).sort();

const search = (query = "") => api.get(`/api/attractions/search${query && `?${query}`}`);

const slugs = (offers) => offers.map(({ slug }) => slug);

const allItems = async (query = "") => {
  const first = await search(query);
  const pages = [first];

  for (let page = 2; page <= first.body.pageCount; page += 1) {
    pages.push(await search(`${query}${query && "&"}page=${page}`));
  }

  return pages.flatMap(({ body }) => body.items);
};

const addAttraction = (slug, data) => {
  const { id, tickets, reviews, ...sample } = samples[0];

  return prisma.attraction.create({ data: { ...sample, id: slug, slug, city: "Tieville", ...data } });
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

describe("GET /api/attractions/search results", () => {
  it("returns the first page in the sample order", async () => {
    const response = await search();

    assert.equal(response.status, 200);
    assert.deepEqual(slugs(response.body.items), slugs(samples.slice(0, PAGE_SIZE)));
  });

  it("returns exactly the keys of Attraction", async () => {
    const { body } = await search();

    for (const attraction of body.items) {
      assert.deepEqual(Object.keys(attraction).sort(), ATTRACTION_KEYS);
    }
  });

  it("fills in the details, with money text", async () => {
    const { body } = await search();
    const [attraction] = body.items;
    const [sample] = samples;

    assert.equal(attraction.name, sample.name);
    assert.equal(attraction.category, sample.category);
    assert.equal(attraction.rating, sample.rating);
    assert.equal(attraction.price, Number(sample.price).toFixed(2));
  });

  it("needs no sign-in", async () => {
    const response = await search().set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });

  it("treats empty values as not set", async () => {
    const response = await search("q=&category=&freeCancellation=&sort=&page=");

    assert.equal(response.status, 200);
    assert.equal(response.body.total, samples.length);
    assert.equal(response.body.page, 1);
  });

  it("treats false as not set", async () => {
    const response = await search("freeCancellation=false");

    assert.equal(response.body.total, samples.length);
  });
});

describe("GET /api/attractions/search filters", () => {
  const [{ name, city, country, category }] = samples;
  const matchesText = (text) => (item) => [item.name, item.city, item.country].some((value) => value.toLowerCase().includes(text));

  const filters = {
    "a name": [`q=${encodeURIComponent(name)}`, ({ slug }) => slug === samples[0].slug],
    "a city": [`q=${encodeURIComponent(city)}`, (item) => item.city === city],
    "a country": [`q=${encodeURIComponent(country)}`, (item) => item.country === country],
    "any letter case": [`q=${encodeURIComponent(city.toUpperCase())}`, (item) => item.city === city],
    "part of a word": ["q=an", matchesText("an")],
    "spaces around the text": [`q=${encodeURIComponent(`  ${city}  `)}`, (item) => item.city === city],
    "free cancellation": ["freeCancellation=true", ({ freeCancellation }) => freeCancellation],
    "text and a category": [`q=an&category=${category}`, (item) => matchesText("an")(item) && item.category === category],
    "a category and free cancellation": [`category=${category}&freeCancellation=true`, (item) => item.category === category && item.freeCancellation],
  };

  for (const value of ["landmarks", "nature", "adventure", "city"]) {
    filters[`the ${value} category`] = [`category=${value}`, (item) => item.category === value];
  }

  for (const [label, [query, matches]] of Object.entries(filters)) {
    it(`filters by ${label}`, async () => {
      const expected = samples.filter(matches);
      const response = await search(query);

      // A filter that matches nothing, or everything, wouldn't prove anything.
      assert.ok(expected.length > 0 && expected.length < samples.length);
      assert.equal(response.body.total, expected.length);
      assert.deepEqual(slugs(await allItems(query)), slugs(expected));
    });
  }

  it("returns an empty result when nothing matches", async () => {
    const response = await search("q=Atlantis");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { items: [], total: 0, page: 1, pageCount: 1 });
  });

  for (const text of ["%25", "_", "%5C", "R%25e", "Ro_e"]) {
    it(`treats ${decodeURIComponent(text)} as plain text, not a wildcard`, async () => {
      const response = await search(`q=${text}`);

      assert.deepEqual(response.body.items, []);
    });
  }
});

describe("GET /api/attractions/search sorting", () => {
  it("uses the sample order for recommended, the default", async () => {
    assert.deepEqual(slugs(await allItems("sort=recommended")), slugs(samples));
    assert.deepEqual(slugs(await allItems()), slugs(samples));
  });

  it("puts the highest rating first, keeping the sample order on a tie", async () => {
    assert.deepEqual(slugs(await allItems("sort=rating")), slugs(samples.toSorted((a, b) => b.rating - a.rating)));
  });

  it("puts the lowest price first, keeping the sample order on a tie", async () => {
    const expected = samples.toSorted((a, b) => Number(a.price) - Number(b.price));

    assert.deepEqual(slugs(await allItems("sort=price-asc")), slugs(expected));
  });

  it("compares prices as money, not text", async () => {
    const { body } = await search("sort=price-asc");
    const prices = body.items.map(({ price }) => Number(price));

    assert.deepEqual(prices, prices.toSorted((a, b) => a - b));
  });

  it("sorts only what matched", async () => {
    const expected = samples.filter(({ freeCancellation }) => freeCancellation).toSorted((a, b) => b.rating - a.rating);

    assert.deepEqual(slugs(await allItems("freeCancellation=true&sort=rating")), slugs(expected));
  });

  it("sorts before paging", async () => {
    const expected = samples.toSorted((a, b) => b.rating - a.rating).slice(PAGE_SIZE);
    const { body } = await search("sort=rating&page=2");

    assert.deepEqual(slugs(body.items), slugs(expected));
  });

  describe("ties", () => {
    before(async () => {
      await addAttraction("tie-z", { sortRank: 500, rating: 3, price: "9.00" });
      await addAttraction("tie-a", { sortRank: 500, rating: 3, price: "9.00" });
      await addAttraction("tie-low-rank", { sortRank: 400, rating: 3, price: "9.00" });
    });

    after(() => prisma.attraction.deleteMany({ where: { city: "Tieville" } }));

    for (const sort of ["recommended", "rating", "price-asc"]) {
      it(`settles a tie in ${sort} by rank, then id`, async () => {
        const items = await allItems(`q=Tieville&sort=${sort}`);

        assert.deepEqual(slugs(items), ["tie-low-rank", "tie-a", "tie-z"]);
      });
    }
  });
});

describe("GET /api/attractions/search paging", () => {
  it("reports the page, the page count and the total", async () => {
    const { body } = await search();

    assert.equal(body.items.length, PAGE_SIZE);
    assert.equal(body.total, samples.length);
    assert.equal(body.page, 1);
    assert.equal(body.pageCount, 2);
  });

  it("returns the next attractions on page 2", async () => {
    const { body } = await search("page=2");

    assert.equal(body.page, 2);
    assert.deepEqual(slugs(body.items), slugs(samples.slice(PAGE_SIZE)));
  });

  it("returns the last page for a page beyond the end", async () => {
    const response = await search("page=99");

    assert.equal(response.status, 200);
    assert.equal(response.body.page, 2);
    assert.deepEqual(slugs(response.body.items), slugs(samples.slice(PAGE_SIZE)));
  });

  it("returns page 1 for a page beyond the end of an empty result", async () => {
    const response = await search("q=Atlantis&page=5");

    assert.equal(response.status, 200);
    assert.equal(response.body.page, 1);
  });

  it("counts only what matched", async () => {
    const expected = samples.filter(({ freeCancellation }) => freeCancellation).length;
    const { body } = await search("freeCancellation=true");

    assert.equal(body.total, expected);
    assert.equal(body.pageCount, Math.ceil(expected / PAGE_SIZE));
  });

  it("has no empty last page when the attractions fill a page exactly", async () => {
    const { body } = await search("page=1");

    assert.equal(body.pageCount, Math.ceil(samples.length / PAGE_SIZE));
    assert.equal(samples.length % PAGE_SIZE, 0);
  });
});

describe("GET /api/attractions/search validation", () => {
  const rejected = {
    q: ["q=Rome&q=Paris", `q=${"x".repeat(101)}`],
    category: ["category=all", "category=beach", "category=LANDMARKS", "category=city&category=nature"],
    freeCancellation: ["freeCancellation=yes", "freeCancellation=1"],
    sort: ["sort=price-desc", "sort=name", "sort=RATING"],
    page: ["page=0", "page=-1", "page=1.5", "page=last"],
  };

  for (const [field, queries] of Object.entries(rejected)) {
    for (const query of queries) {
      it(`rejects ${query.slice(0, 32)}`, async () => {
        const response = await search(query);

        assert.equal(response.status, 400);
        assert.equal(response.body.code, "VALIDATION_ERROR");
        assert.equal(response.body.errors[0].path, field);
      });
    }
  }

  it("accepts a search of 100 characters", async () => {
    const response = await search(`q=${"x".repeat(100)}`);

    assert.equal(response.status, 200);
  });

  it("rejects a null byte", async () => {
    const response = await search("q=%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("only answers GET", async () => {
    const response = await api.post("/api/attractions/search").send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});
