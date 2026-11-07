import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const DEPART_DATE = "2026-12-10";
const RETURN_DATE = "2026-12-17";

const ROUTE = `from=Lagos&to=London&departDate=${DEPART_DATE}`;
const ONE_WAY = `${ROUTE}&tripType=one-way`;
const ROUND_TRIP = `${ROUTE}&tripType=round-trip&returnDate=${RETURN_DATE}`;

const ONE_WAY_ID = "LOS-LHR-1";
const ROUND_TRIP_ID = "LOS-LHR-1_LHR-LOS-1";

const getOffer = (id, query) => api.get(`/api/flights/offers/${encodeURIComponent(id)}?${query}`);

const allOffers = async (query) => {
  const first = await api.get(`/api/flights/search?${query}`);
  const pages = [first];

  for (let page = 2; page <= first.body.pageCount; page += 1) {
    pages.push(await api.get(`/api/flights/search?${query}&page=${page}`));
  }

  return pages.flatMap(({ body }) => body.items);
};

const book = (scheduleId, date, seatsBooked, cabin = "Economy") => {
  return prisma.flightDeparture.create({ data: { scheduleId, date: new Date(date), cabin, seatsBooked } });
};

const assertNotFound = (response) => {
  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { message: "Flight not found", code: "OFFER_NOT_FOUND" });
};

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

describe("GET /api/flights/offers/:id", () => {
  const searches = {
    "one-way": ONE_WAY,
    "a round trip": ROUND_TRIP,
    "Business with a family": `${ROUND_TRIP}&cabin=Business&adults=2&children=1`,
    "First": `${ONE_WAY}&cabin=First`,
    "a different route": `from=Tokyo&to=Miami&departDate=${DEPART_DATE}&tripType=one-way`,
  };

  for (const [name, query] of Object.entries(searches)) {
    it(`returns every offer from a search for ${name}, unchanged`, async () => {
      const offers = await allOffers(query);

      assert.equal(offers.length, 15);

      for (const offer of offers) {
        const response = await getOffer(offer.id, query);

        assert.equal(response.status, 200);
        assert.deepEqual(response.body, offer);
      }
    });
  }

  it("uses the date's own price", async () => {
    const first = await getOffer(ONE_WAY_ID, ONE_WAY);
    const second = await getOffer(ONE_WAY_ID, ONE_WAY.replace(DEPART_DATE, "2026-12-11"));

    assert.equal(first.body.pricePerAdult, 245);
    assert.equal(second.body.pricePerAdult, 247);
    assert.equal(second.body.outbound.date, "2026-12-11");
  });

  it("finds the route in any letter case", async () => {
    const response = await getOffer(ONE_WAY_ID, `from=lagos&to=LONDON&departDate=${DEPART_DATE}&tripType=one-way`);

    assert.equal(response.status, 200);
    assert.equal(response.body.outbound.from, "Lagos");
  });

  it("includes the inbound leg only on a round trip", async () => {
    assert.equal("inbound" in (await getOffer(ONE_WAY_ID, ONE_WAY)).body, false);
    assert.equal((await getOffer(ROUND_TRIP_ID, ROUND_TRIP)).body.inbound.date, RETURN_DATE);
  });

  it("ignores the search's filters, because an offer was already chosen", async () => {
    const plain = await getOffer(ONE_WAY_ID, ONE_WAY);
    const filtered = await getOffer(ONE_WAY_ID, `${ONE_WAY}&stops=2&airlines=Pacific Crest&maxPrice=1&sort=fastest&page=3`);

    assert.deepEqual(filtered.body, plain.body);
  });

  it("ignores nonstop, because the flight was already chosen", async () => {
    const response = await getOffer("LOS-LHR-2", `${ONE_WAY}&nonstop=true`);

    assert.equal(response.status, 200);
  });

  it("needs no sign-in", async () => {
    const response = await getOffer(ONE_WAY_ID, ONE_WAY).set("Authorization", "Bearer not-a-real-token");

    assert.equal(response.status, 200);
  });
});

describe("GET /api/flights/offers/:id seats", () => {
  it("counts seats on the searched date and cabin", async () => {
    await book("LOS-LHR-1", DEPART_DATE, 38);
    await book("LOS-LHR-1", "2026-12-11", 39);
    await book("LOS-LHR-1", DEPART_DATE, 37, "Business");

    const response = await getOffer(ONE_WAY_ID, ONE_WAY);

    assert.equal(response.body.seatsLeft, 2);
  });

  it("counts seats in a cabin other than Economy", async () => {
    await book("LOS-LHR-1", DEPART_DATE, 38, "Business");

    assert.equal((await getOffer(ONE_WAY_ID, `${ONE_WAY}&cabin=Business`)).body.seatsLeft, 2);
    assert.equal("seatsLeft" in (await getOffer(ONE_WAY_ID, ONE_WAY)).body, false);
  });

  it("uses the fuller leg of a round trip", async () => {
    await book("LOS-LHR-1", DEPART_DATE, 36);
    await book("LHR-LOS-1", RETURN_DATE, 38);

    const response = await getOffer(ROUND_TRIP_ID, ROUND_TRIP);

    assert.equal(response.body.seatsLeft, 2);
  });

  it("still returns a sold-out flight, so booking can explain what happened", async () => {
    await book("LOS-LHR-1", DEPART_DATE, 40);

    const response = await getOffer(ONE_WAY_ID, ONE_WAY);

    assert.equal(response.status, 200);
    assert.equal(response.body.seatsLeft, 0);
  });

  it("still returns a flight too small for the party", async () => {
    const response = await getOffer("LOS-LHR-3", `${ONE_WAY}&adults=4`);

    assert.equal(response.status, 200);
    assert.equal(response.body.seatsLeft, 3);
  });
});

describe("GET /api/flights/offers/:id not found", () => {
  const offers = {
    "an unknown id": ["no-such-flight", ONE_WAY],
    "a flight on another route": ["ACC-CDG-1", ONE_WAY],
    "the same flight the other way": ["LHR-LOS-1", ONE_WAY],
    "a different departure city": [ONE_WAY_ID, `from=Accra&to=London&departDate=${DEPART_DATE}&tripType=one-way`],
    "a different destination": [ONE_WAY_ID, `from=Lagos&to=Paris&departDate=${DEPART_DATE}&tripType=one-way`],
    "an unknown city": [ONE_WAY_ID, `from=Atlantis&to=London&departDate=${DEPART_DATE}&tripType=one-way`],
    "wildcards in place of the cities": [ONE_WAY_ID, `from=%25&to=L%25&departDate=${DEPART_DATE}&tripType=one-way`],
    "a round-trip id on a one-way search": [ROUND_TRIP_ID, ONE_WAY],
    "a one-way id on a round trip": [ONE_WAY_ID, ROUND_TRIP],
    "the wrong return flight": ["LOS-LHR-1_LHR-LOS-2", ROUND_TRIP],
    "a return from another route": ["LOS-LHR-1_CDG-ACC-1", ROUND_TRIP],
    "an unknown return flight": ["LOS-LHR-1_nothing", ROUND_TRIP],
    "an empty return flight": ["LOS-LHR-1_", ROUND_TRIP],
    "an extra part": [`${ROUND_TRIP_ID}_LOS-LHR-2`, ROUND_TRIP],
    "an extra empty part": [`${ROUND_TRIP_ID}_`, ROUND_TRIP],
    "a wildcard id": ["%", ONE_WAY],
    "a very long id": ["x".repeat(2000), ONE_WAY],
  };

  for (const [name, [id, query]] of Object.entries(offers)) {
    it(`returns 404 for ${name}`, async () => {
      assertNotFound(await getOffer(id, query));
    });
  }

  it("returns 404 on a round trip when a flight lost its return", async () => {
    await prisma.flightSchedule.update({ where: { id: "LOS-LHR-1" }, data: { returnScheduleId: null } });

    const roundTrip = await getOffer(ROUND_TRIP_ID, ROUND_TRIP);
    const oneWay = await getOffer(ONE_WAY_ID, ONE_WAY);

    await seedFlights();

    assertNotFound(roundTrip);
    assert.equal(oneWay.status, 200);
  });
});

describe("GET /api/flights/offers/:id validation", () => {
  it("needs the same search values as a search", async () => {
    const response = await getOffer(ONE_WAY_ID, "tripType=one-way");

    assert.equal(response.status, 400);
    assert.deepEqual(response.body.errors.map(({ path }) => path).sort(), ["departDate", "from", "to"]);
  });

  it("rejects a return before departure", async () => {
    const response = await getOffer(ROUND_TRIP_ID, `${ROUTE}&returnDate=2026-12-09`);

    assert.equal(response.status, 400);
    assert.equal(response.body.errors[0].path, "returnDate");
  });

  it("rejects a null byte in the id", async () => {
    const response = await api.get(`/api/flights/offers/%00?${ONE_WAY}`);

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_ERROR");
  });

  it("has no route without an id", async () => {
    const response = await api.get(`/api/flights/offers?${ONE_WAY}`);

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });

  it("only answers GET", async () => {
    const response = await api.post(`/api/flights/offers/${ONE_WAY_ID}?${ONE_WAY}`).send({});

    assert.equal(response.status, 404);
    assert.equal(response.body.code, "ROUTE_NOT_FOUND");
  });
});
