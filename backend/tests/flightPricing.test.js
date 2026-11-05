import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Prisma } from "@prisma/client";
import { getDayFactor, getPricePerAdult, getTotalPrice } from "../src/services/flightPricing.service.js";
import { hash } from "../src/utils/hash.js";

// Base fares of LOS-LHR-1 and LOS-LHR-6. The prices below come from the frontend's buildFlightOffers.
const DIRECT = 218.75;
const TWO_STOPS = 157.5;

const lagosToLondon = { from: "Lagos", to: "London", date: "2026-12-10", cabin: "Economy", tripType: "one-way" };

const price = (changes = {}) => getPricePerAdult({ ...lagosToLondon, baseFare: DIRECT, ...changes });

describe("hash", () => {
  it("gives the same number for the same text", () => {
    assert.equal(hash("Lagos|London"), hash("Lagos|London"));
  });

  it("matches the frontend's sample", () => {
    // The route fare for Lagos to London is 175, which is 90 + this.
    assert.equal(hash("Lagos|London") % 500, 85);
  });

  it("stays inside its range for long text", () => {
    assert.ok(hash("x".repeat(5000)) < 100_003);
  });
});

describe("getDayFactor", () => {
  it("gives the same factor for the same route and date", () => {
    assert.equal(getDayFactor("Lagos", "London", "2026-12-10"), getDayFactor("Lagos", "London", "2026-12-10"));
  });

  it("matches the frontend's sample", () => {
    assert.equal(getDayFactor("Lagos", "London", "2026-12-10").toFixed(2), "1.12");
    assert.equal(getDayFactor("Lagos", "London", "2026-12-11").toFixed(2), "1.13");
  });

  it("changes with the date", () => {
    assert.notEqual(getDayFactor("Lagos", "London", "2026-12-10"), getDayFactor("Lagos", "London", "2026-12-11"));
  });

  it("changes with the direction", () => {
    assert.notEqual(getDayFactor("Lagos", "London", "2026-12-10"), getDayFactor("London", "Lagos", "2026-12-10"));
  });

  it("stays between 0.85 and 1.15, and reaches both ends", () => {
    const start = Date.parse("2026-01-01");
    const factors = Array.from({ length: 2000 }, (_, day) => {
      const date = new Date(start + day * 86_400_000).toISOString().slice(0, 10);

      return Number(getDayFactor("Lagos", "London", date).toFixed(2));
    });

    assert.equal(Math.min(...factors), 0.85);
    assert.equal(Math.max(...factors), 1.15);
  });
});

describe("getPricePerAdult", () => {
  const prices = {
    Economy: { "one-way": [245, 176], "round-trip": [441, 318] },
    "Premium Economy": { "one-way": [392, 282], "round-trip": [706, 508] },
    Business: { "one-way": [784, 564], "round-trip": [1411, 1016] },
    First: { "one-way": [1225, 882], "round-trip": [2205, 1588] },
  };

  for (const [cabin, trips] of Object.entries(prices)) {
    for (const [tripType, [direct, twoStops]] of Object.entries(trips)) {
      it(`matches the sample for ${cabin}, ${tripType}`, () => {
        assert.equal(price({ cabin, tripType }), direct);
        assert.equal(price({ cabin, tripType, baseFare: TWO_STOPS }), twoStops);
      });
    }
  }

  it("gives the same price for the same input, every time", () => {
    const results = Array.from({ length: 100 }, () => price({ cabin: "Business", tripType: "round-trip" }));

    assert.equal(new Set(results).size, 1);
  });

  it("returns a whole number", () => {
    for (const baseFare of [99.99, 218.75, 157.55, 500.01]) {
      assert.ok(Number.isInteger(price({ baseFare })));
    }
  });

  it("changes with the date", () => {
    assert.equal(price({ date: "2026-12-11" }), 247);
  });

  it("uses the route's day factor", () => {
    assert.notEqual(price({ from: "Tokyo", to: "Miami" }), price());
  });

  it("accepts a fare as a database Decimal or as text", () => {
    assert.equal(price({ baseFare: new Prisma.Decimal("218.75") }), 245);
    assert.equal(price({ baseFare: "218.75" }), 245);
  });
});

describe("getTotalPrice", () => {
  const parties = {
    "one adult": [1, 0, 245],
    "two adults": [2, 0, 490],
    "an adult and a child": [1, 1, 429],
    "two adults and a child": [2, 1, 674],
    "two adults and three children": [2, 3, 1041],
    "the largest party": [9, 8, 3675],
  };

  for (const [name, [adults, children, total]] of Object.entries(parties)) {
    it(`matches the sample for ${name}`, () => {
      assert.equal(getTotalPrice(245, adults, children), total);
    });
  }

  it("charges a child 75% of an adult fare", () => {
    assert.equal(getTotalPrice(200, 1, 1), 350);
  });

  it("rounds the total", () => {
    assert.equal(getTotalPrice(245, 1, 1), 429);
    assert.ok(Number.isInteger(getTotalPrice(333, 1, 3)));
  });
});
