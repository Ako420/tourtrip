import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const ROUTE = "from=Lagos&to=London&departDate=2026-12-10";
const ONE_WAY = `${ROUTE}&tripType=one-way&adults=2`;
const ROUND_TRIP = `${ROUTE}&tripType=round-trip&returnDate=2026-12-17&adults=2`;

const search = (query) => api.get(`/api/flights/search?${query}`);

const allOffers = async (query) => {
  const first = await search(query);
  const pages = [first];

  for (let page = 2; page <= first.body.pageCount; page += 1) {
    pages.push(await search(`${query}&page=${page}`));
  }

  return pages.flatMap(({ body }) => body.items);
};

const ids = (offers) => offers.map(({ id }) => id);

const inFlightOrder = (offers) => offers.toSorted((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));

const travelMinutes = ({ outbound, inbound }) => outbound.durationMinutes + (inbound?.durationMinutes ?? 0);

const changeSchedule = (id, data) => prisma.flightSchedule.update({ where: { id }, data });

const hour = ({ outbound }) => outbound.departMinutes / 60;

let log;
let oneWay;
let roundTrip;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedFlights();

  oneWay = inFlightOrder(await allOffers(ONE_WAY));
  roundTrip = inFlightOrder(await allOffers(ROUND_TRIP));
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/flights/search filters", () => {
  const filters = {
    "no stops": ["stops=0", ({ outbound }) => outbound.stops === 0],
    "one stop": ["stops=1", ({ outbound }) => outbound.stops === 1],
    "two stops": ["stops=2", ({ outbound }) => outbound.stops === 2],
    "several stop counts": ["stops=0|2", ({ outbound }) => [0, 2].includes(outbound.stops)],
    "one airline": ["airlines=Savanna Air", ({ airline }) => airline === "Savanna Air"],
    "several airlines": ["airlines=Savanna Air|Pacific Crest", ({ airline }) => ["Savanna Air", "Pacific Crest"].includes(airline)],
    "the morning": ["departure=morning", (offer) => hour(offer) >= 6 && hour(offer) < 12],
    "the afternoon": ["departure=afternoon", (offer) => hour(offer) >= 12 && hour(offer) < 18],
    "the evening": ["departure=evening", (offer) => hour(offer) >= 18],
    "the night": ["departure=night", (offer) => hour(offer) < 6],
    "several times of day": ["departure=morning|night", (offer) => hour(offer) < 12],
    "refundable flights": ["refundable=true", ({ refundable }) => refundable],
    "flights with a checked bag": ["checkedBag=true", ({ checkedBag }) => checkedBag],
    "several filters at once": [
      "stops=1&airlines=Savanna Air|Pacific Crest&checkedBag=true",
      ({ outbound, airline, checkedBag }) => outbound.stops === 1 && airline !== "Skybridge Air" && airline !== "Southern Star" && checkedBag,
    ],
  };

  for (const [name, [query, matches]] of Object.entries(filters)) {
    it(`filters by ${name}`, async () => {
      const expected = oneWay.filter(matches);
      const response = await search(`${ONE_WAY}&${query}`);

      // A filter that matches nothing, or everything, wouldn't prove anything.
      assert.ok(expected.length > 0 && expected.length < oneWay.length);
      assert.equal(response.body.total, expected.length);
      assert.deepEqual(ids(inFlightOrder(await allOffers(`${ONE_WAY}&${query}`))), ids(expected));
    });
  }

  it("treats false as not set", async () => {
    const response = await search(`${ONE_WAY}&refundable=false&checkedBag=false`);

    assert.equal(response.body.total, oneWay.length);
  });

  it("treats empty values as not set", async () => {
    const response = await search(`${ONE_WAY}&stops=&airlines=&departure=&maxPrice=&refundable=&checkedBag=&sort=`);

    assert.equal(response.status, 200);
    assert.equal(response.body.total, oneWay.length);
  });

  it("returns an empty result for an airline with no flights", async () => {
    const response = await search(`${ONE_WAY}&airlines=No Such Airline`);

    assert.equal(response.status, 200);
    assert.deepEqual(response.body.items, []);
    assert.equal(response.body.total, 0);
    assert.equal(response.body.page, 1);
    assert.equal(response.body.pageCount, 1);
  });

  it("counts only what matched when paging", async () => {
    const response = await search(`${ONE_WAY}&stops=1`);
    const expected = oneWay.filter(({ outbound }) => outbound.stops === 1).length;

    assert.equal(response.body.total, expected);
    assert.equal(response.body.pageCount, Math.ceil(expected / 6));
  });

  it("removes nonstop before anything else", async () => {
    const response = await search(`${ONE_WAY}&nonstop=true&stops=1`);

    assert.equal(response.body.total, 0);
  });
});

describe("GET /api/flights/search maxPrice", () => {
  const prices = () => oneWay.map(({ totalPrice }) => totalPrice).sort((a, b) => a - b);

  it("includes a flight at exactly that price", async () => {
    const [cheapest] = prices();
    const response = await search(`${ONE_WAY}&maxPrice=${cheapest}`);

    assert.ok(response.body.total >= 1);
    assert.ok(response.body.items.every(({ totalPrice }) => totalPrice === cheapest));
  });

  it("leaves out a flight one dollar over", async () => {
    const [cheapest] = prices();
    const response = await search(`${ONE_WAY}&maxPrice=${cheapest - 1}`);

    assert.equal(response.body.total, 0);
  });

  it("looks at the total, not the price per adult", async () => {
    const cheapest = oneWay.toSorted((a, b) => a.totalPrice - b.totalPrice)[0];
    const response = await search(`${ONE_WAY}&maxPrice=${cheapest.pricePerAdult}`);

    assert.equal(response.body.total, 0);
  });

  it("doesn't count a maximum of 0 as no filter", async () => {
    const response = await search(`${ONE_WAY}&maxPrice=0`);

    assert.equal(response.body.total, 0);
  });
});

describe("GET /api/flights/search on the edges", () => {
  afterEach(seedFlights);

  const windows = {
    "5:59 as the night": [359, "night"],
    "6:00 as the morning": [360, "morning"],
    "11:59 as the morning": [719, "morning"],
    "12:00 as the afternoon": [720, "afternoon"],
    "17:59 as the afternoon": [1079, "afternoon"],
    "18:00 as the evening": [1080, "evening"],
    "23:59 as the evening": [1439, "evening"],
    "0:00 as the night": [0, "night"],
  };

  for (const [name, [departMinutes, window]] of Object.entries(windows)) {
    it(`counts ${name}`, async () => {
      await changeSchedule("LOS-LHR-1", { departMinutes });

      const found = ids(await allOffers(`${ONE_WAY}&departure=${window}`));
      const others = ["morning", "afternoon", "evening", "night"].filter((id) => id !== window);
      const elsewhere = ids(await allOffers(`${ONE_WAY}&departure=${others.join("|")}`));

      assert.ok(found.includes("LOS-LHR-1"));
      assert.ok(!elsewhere.includes("LOS-LHR-1"));
    });
  }

  it("counts three stops as 2 or more", async () => {
    await changeSchedule("LOS-LHR-2", { stops: 3 });

    assert.ok(ids(await allOffers(`${ONE_WAY}&stops=2`)).includes("LOS-LHR-2"));
    assert.ok(!ids(await allOffers(`${ONE_WAY}&stops=1`)).includes("LOS-LHR-2"));
  });

  it("looks only at the outbound leg for stops", async () => {
    await changeSchedule("LHR-LOS-1", { stops: 2 });

    assert.ok(ids(await allOffers(`${ROUND_TRIP}&stops=0`)).includes("LOS-LHR-1_LHR-LOS-1"));
  });

  it("looks only at the outbound leg for the time of day", async () => {
    await changeSchedule("LOS-LHR-1", { departMinutes: 400 });
    await changeSchedule("LHR-LOS-1", { departMinutes: 1200 });

    assert.ok(ids(await allOffers(`${ROUND_TRIP}&departure=morning`)).includes("LOS-LHR-1_LHR-LOS-1"));
    assert.ok(!ids(await allOffers(`${ROUND_TRIP}&departure=evening`)).includes("LOS-LHR-1_LHR-LOS-1"));
  });

  it("counts both legs for fastest", async () => {
    await changeSchedule("LHR-LOS-1", { durationMinutes: 5000 });

    const roundTrips = await allOffers(`${ROUND_TRIP}&sort=fastest`);
    const oneWays = await allOffers(`${ONE_WAY}&sort=fastest`);

    assert.equal(roundTrips.at(-1).id, "LOS-LHR-1_LHR-LOS-1");
    assert.notEqual(oneWays.at(-1).id, "LOS-LHR-1");
  });

  it("keeps the flight order when two flights tie", async () => {
    await changeSchedule("LOS-LHR-10", { departMinutes: 1 });
    await changeSchedule("LOS-LHR-2", { departMinutes: 1 });

    const [first, second] = await allOffers(`${ONE_WAY}&sort=earliest`);

    assert.deepEqual([first.id, second.id], ["LOS-LHR-2", "LOS-LHR-10"]);
  });
});

describe("GET /api/flights/search sorting", () => {
  const best = (offer) => offer.totalPrice + travelMinutes(offer) * 0.5;

  const sorts = {
    best: (a, b) => best(a) - best(b),
    cheapest: (a, b) => a.totalPrice - b.totalPrice,
    fastest: (a, b) => travelMinutes(a) - travelMinutes(b),
    earliest: (a, b) => a.outbound.departMinutes - b.outbound.departMinutes,
  };

  for (const [sort, compare] of Object.entries(sorts)) {
    it(`sorts one-way flights by ${sort}`, async () => {
      assert.deepEqual(ids(await allOffers(`${ONE_WAY}&sort=${sort}`)), ids(oneWay.toSorted(compare)));
    });

    it(`sorts round trips by ${sort}`, async () => {
      assert.deepEqual(ids(await allOffers(`${ROUND_TRIP}&sort=${sort}`)), ids(roundTrip.toSorted(compare)));
    });
  }

  it("uses best when no sort is given", async () => {
    assert.deepEqual(ids(await allOffers(ONE_WAY)), ids(await allOffers(`${ONE_WAY}&sort=best`)));
  });

  it("sorts before paging", async () => {
    const response = await search(`${ONE_WAY}&sort=cheapest&page=2`);

    assert.deepEqual(ids(response.body.items), ids(oneWay.toSorted(sorts.cheapest).slice(6, 12)));
  });

  it("sorts only what matched", async () => {
    const expected = oneWay.filter(({ outbound }) => outbound.stops === 1).toSorted(sorts.fastest);

    assert.deepEqual(ids(await allOffers(`${ONE_WAY}&stops=1&sort=fastest`)), ids(expected));
  });
});

describe("GET /api/flights/search filter validation", () => {
  const rejected = {
    stops: ["stops=3", "stops=-1", "stops=1.5", "stops=two", "stops=0|two", "stops=0&stops=1"],
    departure: ["departure=noon", "departure=morning|noon", "departure=MORNING"],
    maxPrice: ["maxPrice=-1", "maxPrice=cheap", "maxPrice=Infinity", "maxPrice=100000000"],
    refundable: ["refundable=yes", "refundable=1"],
    checkedBag: ["checkedBag=yes", "checkedBag=1"],
    sort: ["sort=price", "sort=BEST"],
    airlines: ["airlines=Skybridge Air&airlines=Pacific Crest"],
  };

  for (const [field, queries] of Object.entries(rejected)) {
    for (const query of queries) {
      it(`rejects ${query.slice(0, 40)}`, async () => {
        const response = await search(`${ONE_WAY}&${query}`);

        assert.equal(response.status, 400);
        assert.equal(response.body.code, "VALIDATION_ERROR");
        assert.equal(response.body.errors[0].path.split(".")[0], field);
      });
    }
  }

  const accepted = [
    "stops=0|1|2", "stops=2|2", "departure=morning|afternoon|evening|night", "maxPrice=0", "maxPrice=99999999.99",
    "maxPrice=500.50", "sort=best", "sort=cheapest", "sort=fastest", "sort=earliest", "airlines=Savanna Air|",
  ];

  for (const query of accepted) {
    it(`accepts ${query}`, async () => {
      const response = await search(`${ONE_WAY}&${query}`);

      assert.equal(response.status, 200);
    });
  }

  it("rejects a null byte in a list", async () => {
    const response = await search(`${ONE_WAY}&airlines=%00`);

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });
});
