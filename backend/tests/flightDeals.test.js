import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, afterEach, before, describe, it } from "node:test";
import { seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/flights.json", import.meta.url), "utf8")).deals;
const airportsFile = readFileSync(new URL("../../frontend/src/data/airports.ts", import.meta.url), "utf8");

const DEAL_KEYS = ["airline", "cabin", "currency", "departDate", "from", "id", "isNonstop", "price", "returnDate", "to"];

const DAY_IN_MS = 86_400_000;

const getDeals = (query = "") => api.get(`/api/flights/deals${query && `?${query}`}`);

const ids = ({ body }) => body.map(({ id }) => id).sort((a, b) => Number(a) - Number(b));

const sampleIds = (matches) => samples.filter(matches).map(({ id }) => id);

const addDeal = (id, departDate, changes = {}) => {
  return prisma.flightDeal.create({
    data: {
      id,
      airlineId: "SB",
      fromCity: "Added",
      toCity: "Later",
      departDate: new Date(departDate),
      returnDate: new Date("2030-01-01"),
      cabin: "Economy",
      price: "100.00",
      ...changes,
    },
  });
};

const dayFromToday = (days) => new Date(Date.now() + days * DAY_IN_MS).toISOString().slice(0, 10);

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedFlights();
});

afterEach(() => prisma.flightDeal.deleteMany({ where: { fromCity: "Added" } }));

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/airports", () => {
  it("returns the frontend's cities in order, as text", async () => {
    const response = await api.get("/api/airports");
    const cities = [...airportsFile.matchAll(/^\s*"([^"]+)",$/gm)].map(([, city]) => city);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, cities);
  });

  it("sorts a new city into place", async () => {
    await prisma.airport.create({ data: { id: "AMS", code: "AMS", city: "Amsterdam", country: "Netherlands" } });

    const response = await api.get("/api/airports");

    await prisma.airport.delete({ where: { id: "AMS" } });

    assert.deepEqual(response.body.slice(0, 2), ["Accra", "Amsterdam"]);
  });

  it("needs no sign-in", async () => {
    const response = await api.get("/api/airports").set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });
});

describe("GET /api/flights/deals", () => {
  it("returns every deal", async () => {
    const response = await getDeals();

    assert.equal(response.status, 200);
    assert.deepEqual(ids(response), samples.map(({ id }) => id));
  });

  it("returns the FlightDeal shape", async () => {
    const response = await getDeals();

    for (const deal of response.body) {
      assert.deepEqual(Object.keys(deal).sort(), DEAL_KEYS);
    }
  });

  it("fills in a deal, using the airline's name, plain dates and money text", async () => {
    await addDeal("shape", "2031-03-04", { airlineId: "PC", returnDate: new Date("2031-03-09"), price: "229.50", isNonstop: true });

    const response = await getDeals("from=Added");

    assert.deepEqual(response.body, [{
      id: "shape",
      airline: "Pacific Crest",
      from: "Added",
      to: "Later",
      departDate: "2031-03-04",
      returnDate: "2031-03-09",
      cabin: "Economy",
      isNonstop: true,
      price: "229.50",
      currency: "USD",
    }]);
  });

  it("says when a deal isn't nonstop", async () => {
    await addDeal("with-stops", "2031-03-04", { isNonstop: false });

    const response = await getDeals("from=Added");

    assert.equal(response.body[0].isNonstop, false);
  });

  it("needs no sign-in", async () => {
    const response = await getDeals().set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });
});

describe("GET /api/flights/deals filters", () => {
  const filters = {
    "a departure city": ["from=Lagos", ({ from }) => from === "Lagos"],
    "a destination city": ["to=London", ({ to }) => to === "London"],
    "both cities": ["from=Lagos&to=London", ({ from, to }) => from === "Lagos" && to === "London"],
    "nonstop deals": ["nonstop=true", ({ isNonstop }) => isNonstop],
    "a city in any letter case": ["from=lAGOS", ({ from }) => from === "Lagos"],
    "part of a city": ["to=ondo", ({ to }) => to === "London"],
    "a city with a space": [`from=${encodeURIComponent("Hong Kong")}`, ({ from }) => from === "Hong Kong"],
    "a city with spaces around it": [`from=${encodeURIComponent("  Lagos  ")}`, ({ from }) => from === "Lagos"],
    "the task's example": ["from=lagos&nonstop=true", ({ from, isNonstop }) => from === "Lagos" && isNonstop],
    "every filter": ["from=lagos&to=london&nonstop=true", ({ from, to, isNonstop }) => from === "Lagos" && to === "London" && isNonstop],
  };

  for (const [name, [query, matches]] of Object.entries(filters)) {
    it(`filters by ${name}`, async () => {
      const expected = sampleIds(matches);
      const response = await getDeals(query);

      // A filter that matches nothing, or everything, wouldn't prove anything.
      assert.ok(expected.length > 0 && expected.length < samples.length);
      assert.deepEqual(ids(response), expected);
    });
  }

  it("keeps from and to apart", async () => {
    const response = await getDeals("from=Tokyo");

    assert.deepEqual(response.body, []);
  });

  it("treats nonstop=false as not set", async () => {
    const response = await getDeals("nonstop=false");

    assert.equal(response.body.length, samples.length);
  });

  it("treats empty values as not set", async () => {
    const response = await getDeals("from=&to=&nonstop=");

    assert.equal(response.status, 200);
    assert.equal(response.body.length, samples.length);
  });

  it("returns an empty list when nothing matches", async () => {
    const response = await getDeals("from=Atlantis");

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  for (const text of ["%25", "_", "L%25", "Lago_", "%5C"]) {
    it(`treats ${decodeURIComponent(text)} as plain text, not a wildcard`, async () => {
      assert.deepEqual((await getDeals(`from=${text}`)).body, []);
      assert.deepEqual((await getDeals(`to=${text}`)).body, []);
    });
  }
});

describe("GET /api/flights/deals availability", () => {
  it("leaves out an inactive deal", async () => {
    await addDeal("hidden", dayFromToday(30), { isActive: false });

    assert.deepEqual((await getDeals("from=Added")).body, []);
  });

  it("leaves out a deal that left yesterday", async () => {
    await addDeal("gone", dayFromToday(-1));

    assert.deepEqual((await getDeals("from=Added")).body, []);
  });

  it("keeps a deal that leaves today", async () => {
    await addDeal("today", dayFromToday(0));

    assert.deepEqual((await getDeals("from=Added")).body.map(({ id }) => id), ["today"]);
  });

  it("uses the departure date, not the return date", async () => {
    await addDeal("left", dayFromToday(-3), { returnDate: new Date(dayFromToday(3)) });

    assert.deepEqual((await getDeals("from=Added")).body, []);
  });

  it("shows soonest first, then by id", async () => {
    await addDeal("later", dayFromToday(30));
    await addDeal("tie-z", dayFromToday(10));
    await addDeal("sooner", dayFromToday(5));
    await addDeal("tie-a", dayFromToday(10));

    const response = await getDeals("from=Added");

    assert.deepEqual(response.body.map(({ id }) => id), ["sooner", "tie-a", "tie-z", "later"]);
  });
});

describe("GET /api/flights/deals validation", () => {
  const rejected = {
    from: ["from=Lagos&from=Accra", `from=${"x".repeat(101)}`],
    to: ["to=Lagos&to=Accra", `to=${"x".repeat(101)}`],
    nonstop: ["nonstop=yes", "nonstop=1", "nonstop=true&nonstop=false"],
  };

  for (const [field, queries] of Object.entries(rejected)) {
    for (const query of queries) {
      it(`rejects ${query.slice(0, 32)}`, async () => {
        const response = await getDeals(query);

        assert.equal(response.status, 400);
        assert.equal(response.body.code, "VALIDATION_ERROR");
        assert.equal(response.body.errors[0].path, field);
      });
    }
  }

  it("accepts a city of 100 characters", async () => {
    const response = await getDeals(`from=${"x".repeat(100)}&to=${"x".repeat(100)}`);

    assert.equal(response.status, 200);
  });

  it("rejects a null byte", async () => {
    const response = await getDeals("from=%00");

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("only answers GET", async () => {
    const response = await api.post("/api/flights/deals").send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});
