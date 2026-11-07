import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { api, closeDatabase, resetDatabase } from "./helpers.js";

const DEPART_DATE = "2026-12-10";
const WEEK = ["2026-12-07", "2026-12-08", "2026-12-09", "2026-12-10", "2026-12-11", "2026-12-12", "2026-12-13"];

const RESULT_KEYS = [
  "airlines", "currency", "fareCalendar", "items", "page", "pageCount", "priceRange", "sortSummary", "total",
];

const AIRLINES = ["Skybridge Air", "Pacific Crest", "Savanna Air", "Southern Star"];

const ROUTE = `from=Lagos&to=London&departDate=${DEPART_DATE}`;
const ONE_WAY = `${ROUTE}&tripType=one-way&adults=2`;
const ROUND_TRIP = `${ROUTE}&tripType=round-trip&returnDate=2026-12-20&adults=2`;

const search = (query) => api.get(`/api/flights/search?${query}`);

const allOffers = async (query) => {
  const first = await search(query);
  const pages = [first];

  for (let page = 2; page <= first.body.pageCount; page += 1) {
    pages.push(await search(`${query}&page=${page}`));
  }

  return pages.flatMap(({ body }) => body.items);
};

const prices = (offers) => offers.map(({ totalPrice }) => totalPrice);

const adultPrices = (offers) => offers.map(({ pricePerAdult }) => pricePerAdult);

const book = (scheduleId, date, seatsBooked = 40) => {
  return prisma.flightDeparture.create({ data: { scheduleId, date: new Date(date), cabin: "Economy", seatsBooked } });
};

const onDay = (query, date) => query.replace(DEPART_DATE, date);

let log;
let offers;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedFlights();

  offers = await allOffers(ONE_WAY);
});

afterEach(() => prisma.flightDeparture.deleteMany());

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("GET /api/flights/search summaries", () => {
  it("returns every field of FlightSearchResult", async () => {
    const { body } = await search(ONE_WAY);

    assert.deepEqual(Object.keys(body).sort(), RESULT_KEYS);
  });

  it("sends the currency", async () => {
    const { body } = await search(ONE_WAY);

    assert.equal(body.currency, "USD");
  });

  const filters = [
    "stops=0", "airlines=Savanna Air", "departure=morning", "maxPrice=1", "refundable=true", "checkedBag=true",
    "sort=fastest", "page=2",
  ];

  for (const filter of filters) {
    it(`keeps priceRange, airlines and fareCalendar the same with ${filter}`, async () => {
      const { body: plain } = await search(ONE_WAY);
      const { body } = await search(`${ONE_WAY}&${filter}`);

      assert.deepEqual(body.priceRange, plain.priceRange);
      assert.deepEqual(body.airlines, plain.airlines);
      assert.deepEqual(body.fareCalendar, plain.fareCalendar);
    });
  }
});

describe("GET /api/flights/search priceRange", () => {
  it("runs from the lowest total to the highest", async () => {
    const { body } = await search(ONE_WAY);

    assert.deepEqual(body.priceRange, { min: Math.min(...prices(offers)), max: Math.max(...prices(offers)) });
  });

  it("sends numbers, which the price slider needs", async () => {
    const { body } = await search(ONE_WAY);

    assert.equal(typeof body.priceRange.min, "number");
    assert.equal(typeof body.priceRange.max, "number");
    assert.ok(body.priceRange.max > body.priceRange.min);
  });

  it("uses only nonstop flights when asked", async () => {
    const nonstop = await allOffers(`${ONE_WAY}&nonstop=true`);
    const { body } = await search(`${ONE_WAY}&nonstop=true`);

    assert.deepEqual(body.priceRange, { min: Math.min(...prices(nonstop)), max: Math.max(...prices(nonstop)) });
    assert.notEqual(body.priceRange.min, Math.min(...prices(offers)));
  });
});

describe("GET /api/flights/search airlines", () => {
  it("lists each airline once, in flight order", async () => {
    const { body } = await search(ONE_WAY);

    assert.deepEqual(body.airlines.map(({ name }) => name), AIRLINES);
  });

  it("gives each airline's lowest total", async () => {
    const { body } = await search(ONE_WAY);

    for (const { name, lowestPrice } of body.airlines) {
      assert.equal(lowestPrice, Math.min(...prices(offers.filter(({ airline }) => airline === name))));
    }
  });

  it("uses only nonstop flights when asked", async () => {
    const nonstop = await allOffers(`${ONE_WAY}&nonstop=true`);
    const { body } = await search(`${ONE_WAY}&nonstop=true`);

    for (const { name, lowestPrice } of body.airlines) {
      assert.equal(lowestPrice, Math.min(...prices(nonstop.filter(({ airline }) => airline === name))));
    }
  });
});

describe("GET /api/flights/search fareCalendar", () => {
  it("covers 3 days either side of the departure date, in order", async () => {
    const { body } = await search(ONE_WAY);

    assert.deepEqual(body.fareCalendar.map(({ date }) => date), WEEK);
  });

  it("crosses into the next month", async () => {
    const { body } = await search(onDay(ONE_WAY, "2026-12-30"));

    assert.equal(body.fareCalendar.at(-1).date, "2027-01-02");
  });

  it("shows the cheapest flight's real price per adult each day, not a lower one", async () => {
    const { body } = await search(ONE_WAY);

    for (const { date, lowestPrice } of body.fareCalendar) {
      assert.equal(lowestPrice, Math.min(...adultPrices(await allOffers(onDay(ONE_WAY, date)))));
    }
  });

  it("matches the sample, which is the cheapest flight", async () => {
    const { body } = await search(`${ROUTE}&tripType=one-way`);

    assert.equal(body.fareCalendar[3].lowestPrice, 176);
  });

  it("changes with the day", async () => {
    const { body } = await search(ONE_WAY);

    assert.ok(new Set(body.fareCalendar.map(({ lowestPrice }) => lowestPrice)).size > 1);
  });

  it("uses the searched cabin and trip", async () => {
    const economy = await search(ROUND_TRIP);
    const business = await search(`${ROUND_TRIP}&cabin=Business`);
    const oneWay = await search(ONE_WAY);

    assert.ok(business.body.fareCalendar[3].lowestPrice > economy.body.fareCalendar[3].lowestPrice);
    assert.ok(economy.body.fareCalendar[3].lowestPrice > oneWay.body.fareCalendar[3].lowestPrice);
  });

  it("uses only nonstop flights when asked, so it shows a fare that can be found", async () => {
    const { body } = await search(`${ONE_WAY}&nonstop=true`);

    for (const { date, lowestPrice } of body.fareCalendar) {
      assert.equal(lowestPrice, Math.min(...adultPrices(await allOffers(`${onDay(ONE_WAY, date)}&nonstop=true`))));
    }
  });

  it("moves to the next cheapest flight when the cheapest is sold out that day", async () => {
    const before = await search(ONE_WAY);
    const cheapest = offers.toSorted((a, b) => a.pricePerAdult - b.pricePerAdult)[0];

    await book(cheapest.id, WEEK[1]);

    const { body } = await search(ONE_WAY);

    assert.ok(body.fareCalendar[1].lowestPrice > before.body.fareCalendar[1].lowestPrice);
    assert.equal(body.fareCalendar[2].lowestPrice, before.body.fareCalendar[2].lowestPrice);
  });

  it("leaves out a day with nothing left", async () => {
    await Promise.all(offers.map(({ id }) => book(id, WEEK[1])));

    const { body } = await search(ONE_WAY);

    assert.deepEqual(body.fareCalendar.map(({ date }) => date), WEEK.toSpliced(1, 1));
  });
});

describe("GET /api/flights/search sortSummary", () => {
  const travelMinutes = ({ outbound }) => outbound.durationMinutes;
  const best = (offer) => offer.totalPrice + travelMinutes(offer) * 0.5;
  const isDirect = ({ outbound }) => outbound.stops === 0;

  it("gives the best and cheapest prices as numbers, which the Price component needs", async () => {
    const { body } = await search(ONE_WAY);
    const lowestScore = offers.toSorted((a, b) => best(a) - best(b))[0];

    assert.equal(body.sortSummary.best, lowestScore.totalPrice);
    assert.equal(body.sortSummary.cheapest, Math.min(...prices(offers)));
    assert.equal(typeof body.sortSummary.best, "number");
    assert.equal(typeof body.sortSummary.cheapest, "number");
  });

  it("gives the fastest time as text", async () => {
    const { body } = await search(ONE_WAY);
    const quickest = Math.min(...offers.map(travelMinutes));

    assert.equal(body.sortSummary.fastest, `${Math.floor(quickest / 60)}h ${quickest % 60}m`);
  });

  it("shows the outbound time of the fastest round trip, as the sample does", async () => {
    const roundTrips = await allOffers(ROUND_TRIP);
    const quickest = roundTrips.toSorted((a, b) => {
      return a.outbound.durationMinutes + a.inbound.durationMinutes - b.outbound.durationMinutes - b.inbound.durationMinutes;
    })[0];
    const { body } = await search(ROUND_TRIP);
    const minutes = quickest.outbound.durationMinutes;

    assert.equal(body.sortSummary.fastest, `${Math.floor(minutes / 60)}h ${minutes % 60}m`);
  });

  it("counts both legs when choosing the fastest round trip", async () => {
    const roundTrips = await allOffers(ROUND_TRIP);
    const [direct, connecting] = [roundTrips.filter(isDirect), roundTrips.filter((offer) => !isDirect(offer))];
    const quickest = connecting.toSorted((a, b) => a.outbound.durationMinutes - b.outbound.durationMinutes)[0];

    // Direct flights are the quickest out, so a slow return makes one of the others the fastest trip.
    await prisma.flightSchedule.updateMany({
      where: { id: { in: direct.map(({ id }) => id.split("_")[1]) } },
      data: { durationMinutes: 5000 },
    });

    const { body } = await search(ROUND_TRIP);

    await seedFlights();

    const minutes = quickest.outbound.durationMinutes;

    assert.equal(body.sortSummary.fastest, `${Math.floor(minutes / 60)}h ${minutes % 60}m`);
  });

  it("uses only the flights that matched", async () => {
    const twoStops = offers.filter(({ outbound }) => outbound.stops === 2);
    const { body } = await search(`${ONE_WAY}&stops=2`);

    assert.equal(body.sortSummary.cheapest, Math.min(...prices(twoStops)));
    assert.notEqual(body.sortSummary.fastest, (await search(ONE_WAY)).body.sortSummary.fastest);
  });

  it("isn't changed by the sort or the page", async () => {
    const { body: plain } = await search(ONE_WAY);
    const { body } = await search(`${ONE_WAY}&sort=earliest&page=2`);

    assert.deepEqual(body.sortSummary, plain.sortSummary);
  });

  it("is an empty object when nothing matches, because the page reads it", async () => {
    const { body } = await search(`${ONE_WAY}&maxPrice=0`);

    assert.deepEqual(body.sortSummary, {});
  });
});

describe("GET /api/flights/search with no flights", () => {
  it("returns empty summaries for an unknown city", async () => {
    const { body } = await search(`from=Atlantis&to=London&departDate=${DEPART_DATE}&tripType=one-way`);

    assert.deepEqual(Object.keys(body).sort(), RESULT_KEYS);
    assert.deepEqual(body.priceRange, { min: 0, max: 0 });
    assert.deepEqual(body.airlines, []);
    assert.deepEqual(body.fareCalendar, []);
    assert.deepEqual(body.sortSummary, {});
    assert.equal(body.currency, "USD");
  });
});
