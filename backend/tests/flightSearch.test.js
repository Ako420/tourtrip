import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const PAGE_SIZE = 6;
const FLIGHTS_ON_A_ROUTE = 15;
const NONSTOP_FLIGHTS = 5;

const DEPART_DATE = "2026-12-10";
const RETURN_DATE = "2026-12-17";

const ROUTE = `from=Lagos&to=London&departDate=${DEPART_DATE}`;
const ROUND_TRIP = `${ROUTE}&tripType=round-trip&returnDate=${RETURN_DATE}`;
const ONE_WAY = `${ROUTE}&tripType=one-way`;

const search = (query) => api.get(`/api/flights/search?${query}`);

const ids = ({ body }) => body.items.map(({ id }) => id);

const allOffers = async (query) => {
  const first = await search(query);
  const pages = [first];

  for (let page = 2; page <= first.body.pageCount; page += 1) {
    pages.push(await search(`${query}&page=${page}`));
  }

  return pages.flatMap(({ body }) => body.items);
};

const findOffer = async (query, id) => (await allOffers(query)).find((offer) => offer.id === id);

let log;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedFlights();
});

afterEach(() => prisma.flightDeparture.deleteMany());

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/flights/search results", () => {
  it("returns offers for a route", async () => {
    const response = await search(ROUND_TRIP);

    assert.equal(response.status, 200);
    assert.equal(response.body.items.length, PAGE_SIZE);
    assert.equal(response.body.total, FLIGHTS_ON_A_ROUTE);
  });

  it("returns a round trip with both legs", async () => {
    const offer = await findOffer(ROUND_TRIP, "LOS-LHR-1_LHR-LOS-1");

    assert.equal(offer.outbound.date, DEPART_DATE);
    assert.equal(offer.inbound.date, RETURN_DATE);
    assert.equal(offer.pricePerAdult, 441);
  });

  it("returns a one-way trip with no inbound leg", async () => {
    const offer = await findOffer(ONE_WAY, "LOS-LHR-1");

    assert.equal("inbound" in offer, false);
    assert.equal(offer.pricePerAdult, 245);
  });

  it("passes on the cabin and the party", async () => {
    const offer = await findOffer(`${ONE_WAY}&cabin=Business&adults=2&children=1`, "LOS-LHR-1");

    assert.equal(offer.cabin, "Business");
    assert.equal(offer.pricePerAdult, 784);
    assert.equal(offer.totalPrice, 2156);
  });

  it("fills in the defaults", async () => {
    const { body } = await search(`${ROUTE}&returnDate=${RETURN_DATE}`);
    const [offer] = body.items;

    assert.equal(offer.cabin, "Economy");
    assert.ok(offer.inbound);
    assert.equal(offer.totalPrice, offer.pricePerAdult);
  });

  it("finds a route in any letter case", async () => {
    const response = await search(`from=lagos&to=LONDON&departDate=${DEPART_DATE}&tripType=one-way`);

    assert.equal(response.body.total, FLIGHTS_ON_A_ROUTE);
    assert.equal(response.body.items[0].outbound.from, "Lagos");
  });

  it("gives the same results every time", async () => {
    const first = await search(`${ROUND_TRIP}&cabin=First&adults=2&children=2&page=2`);
    const second = await search(`${ROUND_TRIP}&cabin=First&adults=2&children=2&page=2`);

    assert.deepEqual(second.body, first.body);
  });

  it("uses seats left on the searched date", async () => {
    await prisma.flightDeparture.create({
      data: { scheduleId: "LOS-LHR-1", date: new Date(DEPART_DATE), cabin: "Economy", seatsBooked: 38 },
    });

    const offer = await findOffer(ONE_WAY, "LOS-LHR-1");

    assert.equal(offer.seatsLeft, 2);
  });

  it("needs no sign-in", async () => {
    const response = await search(ROUND_TRIP).set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });
});

describe("GET /api/flights/search unknown cities", () => {
  const cities = {
    "an unknown departure": `from=Atlantis&to=London`,
    "an unknown destination": `from=Lagos&to=Atlantis`,
    "two unknown cities": `from=Atlantis&to=Narnia`,
    "part of a city": `from=Lag&to=London`,
    "a % wildcard": `from=%25&to=London`,
    "two wildcards": `from=%25&to=_____`,
  };

  for (const [name, route] of Object.entries(cities)) {
    it(`returns an empty result, not an error, for ${name}`, async () => {
      const response = await search(`${route}&departDate=${DEPART_DATE}&tripType=one-way`);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body.items, []);
      assert.equal(response.body.total, 0);
      assert.equal(response.body.page, 1);
      assert.equal(response.body.pageCount, 1);
    });
  }
});

describe("GET /api/flights/search nonstop", () => {
  it("keeps only flights with no stops", async () => {
    const { body } = await search(`${ONE_WAY}&nonstop=true`);

    assert.equal(body.total, NONSTOP_FLIGHTS);
    assert.ok(body.items.every(({ outbound }) => outbound.stops === 0));
  });

  it("removes them before paging", async () => {
    const { body } = await search(`${ONE_WAY}&nonstop=true`);

    assert.equal(body.items.length, NONSTOP_FLIGHTS);
    assert.equal(body.pageCount, 1);
  });

  it("keeps every flight when it's false or empty", async () => {
    assert.equal((await search(`${ONE_WAY}&nonstop=false`)).body.total, FLIGHTS_ON_A_ROUTE);
    assert.equal((await search(`${ONE_WAY}&nonstop=`)).body.total, FLIGHTS_ON_A_ROUTE);
  });
});

describe("GET /api/flights/search paging", () => {
  it("reports the page, the page count and the total", async () => {
    const { body } = await search(ONE_WAY);

    assert.equal(body.page, 1);
    assert.equal(body.pageCount, 3);
    assert.equal(body.total, FLIGHTS_ON_A_ROUTE);
  });

  it("returns the next flights on page 2", async () => {
    const first = await search(ONE_WAY);
    const second = await search(`${ONE_WAY}&page=2`);

    assert.equal(second.body.page, 2);
    assert.equal(second.body.items.length, PAGE_SIZE);
    assert.ok(ids(second).every((id) => !ids(first).includes(id)));
  });

  it("returns what's left on the last page", async () => {
    const response = await search(`${ONE_WAY}&page=3`);

    assert.equal(response.body.items.length, FLIGHTS_ON_A_ROUTE - PAGE_SIZE * 2);
  });

  it("shows every flight exactly once across the pages", async () => {
    const found = (await allOffers(ONE_WAY)).map(({ id }) => id);

    assert.equal(found.length, FLIGHTS_ON_A_ROUTE);
    assert.equal(new Set(found).size, FLIGHTS_ON_A_ROUTE);
  });

  it("returns the last page for a page beyond the end", async () => {
    const response = await search(`${ONE_WAY}&page=99`);

    assert.equal(response.status, 200);
    assert.equal(response.body.page, 3);
    assert.equal(response.body.items.length, FLIGHTS_ON_A_ROUTE % PAGE_SIZE);
  });
});

describe("GET /api/flights/search required values", () => {
  const missing = {
    from: `to=London&departDate=${DEPART_DATE}&tripType=one-way`,
    to: `from=Lagos&departDate=${DEPART_DATE}&tripType=one-way`,
    departDate: "from=Lagos&to=London&tripType=one-way",
    returnDate: ROUTE,
  };

  for (const [field, query] of Object.entries(missing)) {
    it(`needs ${field}`, async () => {
      const response = await search(query);

      assert.equal(response.status, 400);
      assert.equal(response.body.code, "VALIDATION_ERROR");
      assert.deepEqual(response.body.errors.map(({ path }) => path), [field]);
    });
  }

  it("names every missing value at once", async () => {
    const response = await search("tripType=one-way");

    assert.deepEqual(response.body.errors.map(({ path }) => path).sort(), ["departDate", "from", "to"]);
  });

  it("doesn't count spaces as a city", async () => {
    const noFrom = await search(`from=%20%20&to=London&departDate=${DEPART_DATE}&tripType=one-way`);
    const noTo = await search(`from=Lagos&to=%20%20&departDate=${DEPART_DATE}&tripType=one-way`);

    assert.equal(noFrom.body.errors[0].path, "from");
    assert.equal(noTo.body.errors[0].path, "to");
  });
});

describe("GET /api/flights/search dates and cities", () => {
  const rejected = {
    "a return before departure": [`${ROUTE}&returnDate=2026-12-09`, "returnDate"],
    "a return on the departure date": [`${ROUTE}&returnDate=${DEPART_DATE}`, "returnDate"],
    "a badly written departure date": ["from=Lagos&to=London&departDate=10-12-2026&tripType=one-way", "departDate"],
    "a departure date that doesn't exist": ["from=Lagos&to=London&departDate=2026-02-30&tripType=one-way", "departDate"],
    "a badly written return date": [`${ROUTE}&returnDate=soon`, "returnDate"],
    "the same city twice": [`from=Lagos&to=Lagos&departDate=${DEPART_DATE}&tripType=one-way`, "to"],
    "the same city in another letter case": [`from=Lagos&to=lAGOS&departDate=${DEPART_DATE}&tripType=one-way`, "to"],
    "the same city after spaces": [`from=Lagos&to=%20Lagos%20&departDate=${DEPART_DATE}&tripType=one-way`, "to"],
  };

  for (const [name, [query, field]] of Object.entries(rejected)) {
    it(`rejects ${name}`, async () => {
      const response = await search(query);

      assert.equal(response.status, 400);
      assert.equal(response.body.code, "VALIDATION_ERROR");
      assert.deepEqual(response.body.errors.map(({ path }) => path), [field]);
    });
  }

  it("ignores a return date left on a one-way search, even an early one", async () => {
    const response = await search(`${ONE_WAY}&returnDate=2026-12-01`);

    assert.equal(response.status, 200);
    assert.equal("inbound" in response.body.items[0], false);
  });

  it("explains a return before departure", async () => {
    const response = await search(`${ROUTE}&returnDate=2026-12-09`);

    assert.equal(response.body.errors[0].message, "Return must be after departure");
  });
});

describe("GET /api/flights/search validation", () => {
  const rejected = {
    tripType: ["tripType=multi-city", "tripType=one-way&tripType=round-trip"],
    cabin: ["cabin=Coach", "cabin=economy"],
    adults: ["adults=0", "adults=10", "adults=1.5", "adults=many"],
    children: ["children=-1", "children=9", "children=1.5", "children=many"],
    nonstop: ["nonstop=yes", "nonstop=1"],
    page: ["page=0", "page=-1", "page=1.5", "page=last"],
    from: [`from=${"x".repeat(101)}`, "from=Lagos&from=Accra"],
    to: [`to=${"x".repeat(101)}`, "to=London&to=Paris"],
  };

  for (const [field, queries] of Object.entries(rejected)) {
    for (const query of queries) {
      it(`rejects ${query.slice(0, 36)}`, async () => {
        const others = ONE_WAY.split("&").filter((pair) => !pair.startsWith(`${field}=`)).join("&");
        const response = await search(`${others}&${query}`);

        assert.equal(response.status, 400);
        assert.equal(response.body.code, "VALIDATION_ERROR");
        assert.equal(response.body.errors[0].path, field);
      });
    }
  }

  const accepted = [
    "adults=1", "adults=9", "children=0", "children=8", "cabin=Economy", "cabin=Premium%20Economy", "cabin=Business",
    "cabin=First", "page=1",
  ];

  for (const query of accepted) {
    it(`accepts ${query}`, async () => {
      const response = await search(`${ONE_WAY}&${query}`);

      assert.equal(response.status, 200);
    });
  }

  it("accepts a city of 100 characters", async () => {
    const response = await search(`from=${"x".repeat(100)}&to=London&departDate=${DEPART_DATE}&tripType=one-way`);

    assert.equal(response.status, 200);
  });

  it("treats empty values as not set", async () => {
    const response = await search(`${ONE_WAY}&adults=&children=&cabin=&nonstop=&page=&returnDate=`);

    assert.equal(response.status, 200);
    assert.equal(response.body.total, FLIGHTS_ON_A_ROUTE);
  });

  it("rejects a null byte", async () => {
    const response = await search(`from=%00&to=London&departDate=${DEPART_DATE}&tripType=one-way`);

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("only answers GET", async () => {
    const response = await api.post("/api/flights/search").send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});
