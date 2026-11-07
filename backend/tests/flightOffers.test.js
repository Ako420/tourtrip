import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { getFlightOffers } from "../src/services/flightOffer.service.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const OFFER_KEYS = [
  "aircraft", "airline", "cabin", "checkedBag", "currency", "flightNumber", "id", "outbound", "pricePerAdult",
  "refundable", "totalPrice",
];

const LEG_KEYS = ["date", "departMinutes", "durationMinutes", "from", "stops", "to"];

const DEPART_DATE = "2026-12-10";
const RETURN_DATE = "2026-12-17";

const oneWay = {
  from: "Lagos",
  to: "London",
  departDate: DEPART_DATE,
  tripType: "one-way",
  cabin: "Economy",
  adults: 1,
  children: 0,
};

const roundTrip = { ...oneWay, tripType: "round-trip", returnDate: RETURN_DATE };

// JSON, because that's what reaches the frontend. It leaves out anything undefined.
const search = async (changes = {}) => JSON.parse(JSON.stringify(await getFlightOffers({ ...oneWay, ...changes })));

const searchRoundTrip = (changes = {}) => search({ ...roundTrip, ...changes });

const find = (offers, id) => offers.find((offer) => offer.id === id);

const book = (scheduleId, seatsBooked, date = DEPART_DATE, cabin = "Economy") => {
  return prisma.flightDeparture.create({ data: { scheduleId, date: new Date(date), cabin, seatsBooked } });
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

describe("getFlightOffers shape", () => {
  it("returns a one-way offer as FlightOffer, with no inbound leg", async () => {
    const [offer] = await search();

    assert.deepEqual(Object.keys(offer).sort(), OFFER_KEYS);
    assert.deepEqual(Object.keys(offer.outbound).sort(), LEG_KEYS);
  });

  it("adds the inbound leg to a round trip", async () => {
    const [offer] = await searchRoundTrip();

    assert.deepEqual(Object.keys(offer).sort(), [...OFFER_KEYS, "inbound"].sort());
    assert.deepEqual(Object.keys(offer.inbound).sort(), LEG_KEYS);
  });

  it("fills in a flight's details, using the airline's name", async () => {
    const [offer] = await search();

    assert.equal(offer.airline, "Skybridge Air");
    assert.equal(offer.flightNumber, "SB 717");
    assert.equal(offer.aircraft, "Airbus A350");
    assert.equal(offer.cabin, "Economy");
    assert.equal(offer.currency, "USD");
    assert.equal(offer.checkedBag, true);
    assert.equal(offer.refundable, false);
  });

  it("uses the searched cabin", async () => {
    const [offer] = await search({ cabin: "Business" });

    assert.equal(offer.cabin, "Business");
  });

  it("fills in each leg with cities and its own date", async () => {
    const [{ outbound, inbound }] = await searchRoundTrip();

    assert.deepEqual(outbound, { from: "Lagos", to: "London", date: DEPART_DATE, departMinutes: 305, durationMinutes: 265, stops: 0 });
    assert.equal(inbound.from, "London");
    assert.equal(inbound.to, "Lagos");
    assert.equal(inbound.date, RETURN_DATE);
  });

  it("includes the stop city only when there's a stop", async () => {
    const offers = await search();

    assert.equal(find(offers, "LOS-LHR-2").outbound.stopCity, "Istanbul");
    assert.equal("stopCity" in find(offers, "LOS-LHR-1").outbound, false);
  });

  it("sends prices as numbers", async () => {
    const [offer] = await search();

    assert.equal(typeof offer.pricePerAdult, "number");
    assert.equal(typeof offer.totalPrice, "number");
  });
});

describe("getFlightOffers ids", () => {
  it("uses the schedule id for one-way", async () => {
    const [offer] = await search();

    assert.equal(offer.id, "LOS-LHR-1");
  });

  it("joins both schedule ids for a round trip", async () => {
    const [offer] = await searchRoundTrip();

    assert.equal(offer.id, "LOS-LHR-1_LHR-LOS-1");
  });

  it("lists every flight in order, with 2 before 10", async () => {
    const offers = await search();

    assert.deepEqual(offers.map(({ id }) => Number(id.split("-")[2])), Array.from({ length: 15 }, (_, index) => index + 1));
  });
});

describe("getFlightOffers repeatability", () => {
  it("gives the same ids and prices for the same search", async () => {
    const first = await searchRoundTrip({ cabin: "Business", adults: 2, children: 1 });
    const second = await searchRoundTrip({ cabin: "Business", adults: 2, children: 1 });

    assert.deepEqual(second, first);
  });

  it("gives the same ids and prices after seeding again", async () => {
    const first = await searchRoundTrip();

    await seedFlights();

    assert.deepEqual(await searchRoundTrip(), first);
  });
});

describe("getFlightOffers prices", () => {
  // From the frontend's buildFlightOffers.
  const prices = {
    "Economy one-way": [{ cabin: "Economy", tripType: "one-way" }, 245, 674],
    "Economy round trip": [{ cabin: "Economy", tripType: "round-trip", returnDate: RETURN_DATE }, 441, 1213],
    "Business one-way": [{ cabin: "Business", tripType: "one-way" }, 784, 2156],
    "First round trip": [{ cabin: "First", tripType: "round-trip", returnDate: RETURN_DATE }, 2205, 6064],
  };

  for (const [name, [changes, pricePerAdult, totalPrice]] of Object.entries(prices)) {
    it(`matches the sample for ${name}, 2 adults and a child`, async () => {
      const [offer] = await search({ ...changes, adults: 2, children: 1 });

      assert.equal(offer.pricePerAdult, pricePerAdult);
      assert.equal(offer.totalPrice, totalPrice);
    });
  }

  it("prices from the outbound date, as the sample does", async () => {
    const [first] = await searchRoundTrip();
    const [second] = await searchRoundTrip({ returnDate: "2026-12-20" });

    assert.equal(second.pricePerAdult, first.pricePerAdult);
  });

  it("gives a route the same price however the city is typed", async () => {
    const [offer] = await search({ from: "lagos", to: "LONDON" });

    assert.equal(offer.pricePerAdult, 245);
  });
});

describe("getFlightOffers cities", () => {
  it("finds a route in any letter case, and shows the real city name", async () => {
    const offers = await search({ from: "lagos", to: "LONDON" });

    assert.equal(offers.length, 15);
    assert.equal(offers[0].outbound.from, "Lagos");
    assert.equal(offers[0].outbound.to, "London");
  });

  const empty = {
    "an unknown city": { to: "Atlantis" },
    "the same city twice": { to: "Lagos" },
    "part of a city name": { from: "Lag" },
    "a % wildcard": { from: "%", to: "%" },
    "a _ wildcard": { from: "Lago_" },
    "a wildcard in one city": { to: "L%" },
  };

  for (const [name, changes] of Object.entries(empty)) {
    it(`returns nothing for ${name}`, async () => {
      assert.deepEqual(await search(changes), []);
    });
  }
});

describe("getFlightOffers seats", () => {
  it("leaves out seatsLeft on a flight with plenty of seats", async () => {
    const [offer] = await search();

    assert.equal("seatsLeft" in offer, false);
  });

  it("shows seatsLeft on a small flight, as the sample does", async () => {
    const offers = await search();

    assert.equal(find(offers, "LOS-LHR-3").seatsLeft, 3);
  });

  it("shows seatsLeft when exactly 5 remain", async () => {
    await book("LOS-LHR-1", 35);

    const offers = await search();

    assert.equal(find(offers, "LOS-LHR-1").seatsLeft, 5);
  });

  it("leaves out seatsLeft when 6 remain", async () => {
    await book("LOS-LHR-1", 34);

    const offers = await search();

    assert.equal("seatsLeft" in find(offers, "LOS-LHR-1"), false);
  });

  it("counts only the searched date and cabin", async () => {
    await book("LOS-LHR-1", 38, "2026-12-11");
    await book("LOS-LHR-1", 38, DEPART_DATE, "Business");

    const offers = await search();

    assert.equal("seatsLeft" in find(offers, "LOS-LHR-1"), false);
  });

  it("counts each schedule on its own", async () => {
    await book("LOS-LHR-1", 38);

    const offers = await search();

    assert.equal(find(offers, "LOS-LHR-1").seatsLeft, 2);
    assert.equal("seatsLeft" in find(offers, "LOS-LHR-2"), false);
  });

  it("uses the fuller leg of a round trip", async () => {
    await book("LOS-LHR-1", 35);
    await book("LHR-LOS-1", 38, RETURN_DATE);

    const offers = await searchRoundTrip();

    assert.equal(find(offers, "LOS-LHR-1_LHR-LOS-1").seatsLeft, 2);
  });

  it("looks up the return leg on the return date", async () => {
    await book("LHR-LOS-1", 38, DEPART_DATE);

    const offers = await searchRoundTrip();

    assert.equal("seatsLeft" in find(offers, "LOS-LHR-1_LHR-LOS-1"), false);
  });

  it("ignores the return leg on a one-way search", async () => {
    await book("LHR-LOS-1", 40, DEPART_DATE);

    const offers = await search();

    assert.ok(find(offers, "LOS-LHR-1"));
  });
});

describe("getFlightOffers sold-out flights", () => {
  it("leaves out a flight with no seats, which the card would show as a 0", async () => {
    await book("LOS-LHR-1", 40);

    const offers = await search();

    assert.equal(find(offers, "LOS-LHR-1"), undefined);
    assert.equal(offers.length, 14);
  });

  it("leaves out a round trip when either leg is full", async () => {
    await book("LHR-LOS-1", 40, RETURN_DATE);

    const offers = await searchRoundTrip();

    assert.equal(find(offers, "LOS-LHR-1_LHR-LOS-1"), undefined);
  });

  it("leaves out a flight without enough seats for the party", async () => {
    const offers = await search({ adults: 3, children: 1 });

    assert.equal(find(offers, "LOS-LHR-3"), undefined);
    assert.ok(find(offers, "LOS-LHR-1"));
  });

  it("keeps a flight with exactly enough seats, counting children", async () => {
    const offers = await search({ adults: 2, children: 1 });

    assert.equal(find(offers, "LOS-LHR-3").seatsLeft, 3);
  });
});

describe("getFlightOffers without a return flight", () => {
  before(async () => {
    await prisma.flightSchedule.update({ where: { id: "LOS-LHR-1" }, data: { returnScheduleId: null } });
  });

  after(seedFlights);

  it("leaves it out of round trips", async () => {
    const offers = await searchRoundTrip();

    assert.equal(find(offers, "LOS-LHR-1_LHR-LOS-1"), undefined);
    assert.equal(offers.length, 14);
  });

  it("keeps it on one-way searches", async () => {
    const offers = await search();

    assert.ok(find(offers, "LOS-LHR-1"));
  });
});
