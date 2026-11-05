import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { after, before, describe, it } from "node:test";
import { moveToFuture, seedFlights } from "../prisma/seed-flights.js";
import { prisma } from "../src/config/db.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const samples = JSON.parse(readFileSync(new URL("../prisma/seed-data/flights.json", import.meta.url), "utf8"));
const airportsFile = readFileSync(new URL("../../frontend/src/data/airports.ts", import.meta.url), "utf8");

const AIRPORTS = 14;
const ROUTES = AIRPORTS * (AIRPORTS - 1);
const SCHEDULES_PER_ROUTE = 15;
const SCHEDULES = ROUTES * SCHEDULES_PER_ROUTE;

// Values from the frontend's buildFlightOffers, for a one-way Economy search on each route.
const SAMPLE_OFFERS = {
  "LOS-LHR-1": ["Skybridge Air", "SB 717", "Airbus A350", 305, 265, 0, null, true, false],
  "LOS-LHR-2": ["Pacific Crest", "PC 754", "Boeing 787", 400, 385, 1, "Istanbul", false, true],
  "LOS-LHR-3": ["Savanna Air", "SV 791", "Airbus A330", 495, 395, 1, "Doha", true, false],
  "LOS-LHR-6": ["Pacific Crest", "PC 102", "Boeing 787", 790, 585, 2, "Dubai", false, true],
  "HND-MIA-1": ["Skybridge Air", "SB 404", "Airbus A350", 345, 125, 0, null, true, false],
  "HND-MIA-2": ["Pacific Crest", "PC 441", "Boeing 787", 445, 245, 1, "Singapore", false, true],
  "HND-MIA-3": ["Savanna Air", "SV 478", "Airbus A330", 540, 255, 1, "Dubai", true, false],
  "HND-MIA-6": ["Pacific Crest", "PC 589", "Boeing 787", 830, 445, 2, "Frankfurt", false, true],
};

const countRows = async () => ({
  airports: await prisma.airport.count(),
  airlines: await prisma.airline.count(),
  schedules: await prisma.flightSchedule.count(),
  deals: await prisma.flightDeal.count(),
});

const toDay = (date) => date.toISOString().slice(0, 10);

let log;
let schedules;

before(async () => {
  log = console.log;
  console.log = () => {};

  await resetDatabase();
  await seedFlights();

  schedules = await prisma.flightSchedule.findMany({ include: { fromAirport: true, toAirport: true } });
});

after(async () => {
  console.log = log;
  await closeDatabase();
});

describe("seedFlights airports and airlines", () => {
  it("creates the sample's rows", async () => {
    assert.deepEqual(await countRows(), { airports: AIRPORTS, airlines: 4, schedules: SCHEDULES, deals: 12 });
  });

  it("uses the frontend's list of cities", async () => {
    const airports = await prisma.airport.findMany();
    const cities = [...airportsFile.matchAll(/^\s*"([^"]+)",$/gm)].map(([, city]) => city);

    assert.equal(cities.length, AIRPORTS);
    assert.deepEqual(airports.map(({ city }) => city).sort(), cities.sort());
  });

  it("gives each airport a three-letter code and a country", async () => {
    for (const { code, country } of await prisma.airport.findMany()) {
      assert.match(code, /^[A-Z]{3}$/);
      assert.ok(country.length > 0);
    }
  });

  it("creates the four airlines", async () => {
    const airlines = await prisma.airline.findMany({ orderBy: { code: "asc" } });

    assert.deepEqual(airlines.map(({ code, name }) => [code, name]), [
      ["PC", "Pacific Crest"],
      ["SB", "Skybridge Air"],
      ["SS", "Southern Star"],
      ["SV", "Savanna Air"],
    ]);
  });
});

describe("seedFlights schedules", () => {
  it("covers every ordered pair of cities", () => {
    const routes = new Map();

    for (const { fromAirportId, toAirportId } of schedules) {
      const route = `${fromAirportId}-${toAirportId}`;

      routes.set(route, (routes.get(route) ?? 0) + 1);
    }

    assert.equal(routes.size, ROUTES);
    assert.ok([...routes.values()].every((count) => count === SCHEDULES_PER_ROUTE));
  });

  it("never flies a city to itself", () => {
    assert.ok(schedules.every(({ fromAirportId, toAirportId }) => fromAirportId !== toAirportId));
  });

  it("gives every flight a return the other way, on the same airline, with the same stops", () => {
    const byId = new Map(schedules.map((schedule) => [schedule.id, schedule]));

    for (const schedule of schedules) {
      const back = byId.get(schedule.returnScheduleId);

      assert.equal(back.fromAirportId, schedule.toAirportId);
      assert.equal(back.toAirportId, schedule.fromAirportId);
      assert.equal(back.airlineId, schedule.airlineId);
      assert.equal(back.stops, schedule.stops);
      assert.equal(back.returnScheduleId, schedule.id);
    }
  });

  it("uses ids that can be joined into an offer id", () => {
    assert.ok(schedules.every(({ id }) => /^[A-Z]{3}-[A-Z]{3}-\d{1,2}$/.test(id)));
  });

  for (const [id, expected] of Object.entries(SAMPLE_OFFERS)) {
    it(`matches the frontend's sample for ${id}`, async () => {
      const schedule = await prisma.flightSchedule.findUnique({ where: { id }, include: { airline: true } });
      const { airline, flightNumber, aircraft, departMinutes, durationMinutes, stops, stopCity } = schedule;

      assert.deepEqual(
        [airline.name, flightNumber, aircraft, departMinutes, durationMinutes, stops, stopCity, schedule.checkedBag, schedule.refundable],
        expected,
      );
    });
  }

  // Fares that give the sample's price for each flight once the day factor is applied.
  for (const [id, fare] of Object.entries({ "LOS-LHR-1": 218.75, "LOS-LHR-2": 185.5, "LOS-LHR-6": 157.5 })) {
    it(`gives ${id} the sample's base fare`, async () => {
      const { baseFare } = await prisma.flightSchedule.findUnique({ where: { id } });

      assert.equal(baseFare.toNumber(), fare);
    });
  }

  it("gives the small flights 3 seats, which the sample shows as nearly full", async () => {
    const small = schedules.filter(({ seatsPerCabin }) => seatsPerCabin === 3);
    const numbers = new Set(small.map(({ id }) => Number(id.split("-")[2])));

    assert.deepEqual([...numbers].sort((a, b) => a - b), [3, 9, 15]);
    assert.ok(schedules.every(({ seatsPerCabin }) => [3, 40].includes(seatsPerCabin)));
  });

  it("lists a stop city only on flights with stops", () => {
    for (const { stops, stopCity } of schedules) {
      assert.equal(stopCity !== null, stops > 0);
    }
  });

  it("never stops at the flight's own origin or destination", () => {
    for (const { stopCity, fromAirport, toAirport } of schedules) {
      assert.notEqual(stopCity, fromAirport.city);
      assert.notEqual(stopCity, toAirport.city);
    }
  });

  it("keeps times inside a day and on five-minute steps", () => {
    for (const { departMinutes, durationMinutes } of schedules) {
      assert.ok(departMinutes >= 0 && departMinutes < 1440);
      assert.equal(departMinutes % 5, 0);
      assert.ok(durationMinutes > 0);
      assert.equal(durationMinutes % 5, 0);
    }
  });

  it("gives both directions of a route the same flying time", () => {
    const byId = new Map(schedules.map((schedule) => [schedule.id, schedule]));

    for (const { durationMinutes, returnScheduleId } of schedules) {
      assert.equal(byId.get(returnScheduleId).durationMinutes, durationMinutes);
    }
  });

  it("charges less for more stops, on the same route and fare step", async () => {
    const [direct, oneStop] = await Promise.all(
      ["LOS-LHR-1", "LOS-LHR-11"].map((id) => prisma.flightSchedule.findUnique({ where: { id } })),
    );

    assert.equal(direct.stops, 0);
    assert.equal(oneStop.stops, 1);
    assert.ok(oneStop.baseFare.lessThan(direct.baseFare));
  });
});

describe("seedFlights deals", () => {
  it("links each deal to its airline and keeps its details", async () => {
    const deals = await prisma.flightDeal.findMany({ include: { airline: true } });

    assert.equal(deals.length, samples.deals.length);

    for (const sample of samples.deals) {
      const deal = deals.find(({ id }) => id === sample.id);

      assert.equal(deal.airline.name, sample.airline);
      assert.equal(deal.fromCity, sample.from);
      assert.equal(deal.toCity, sample.to);
      assert.equal(deal.cabin, sample.cabin);
      assert.equal(deal.isNonstop, sample.isNonstop);
      assert.equal(deal.price.toNumber(), sample.price);
      assert.equal(deal.currency, sample.currency);
      assert.equal(deal.isActive, true);
    }
  });

  it("has no deal in the past", async () => {
    const today = toDay(new Date());

    for (const { departDate } of await prisma.flightDeal.findMany()) {
      assert.ok(toDay(departDate) >= today);
    }
  });

  it("moves deals forward when seeded after they've passed", async (t) => {
    t.mock.timers.enable({ apis: ["Date"], now: new Date("2027-06-01") });

    await seedFlights();

    const deals = await prisma.flightDeal.findMany();

    t.mock.timers.reset();
    await seedFlights();

    assert.ok(deals.every(({ departDate }) => toDay(departDate) >= "2027-06-01"));
  });

  it("keeps each deal's length", async () => {
    const days = ({ departDate, returnDate }) => (Date.parse(returnDate) - Date.parse(departDate)) / 86_400_000;

    for (const deal of await prisma.flightDeal.findMany()) {
      assert.equal(days(deal), days(samples.deals.find(({ id }) => id === deal.id)));
    }
  });
});

describe("moveToFuture", () => {
  const move = (departDate, returnDate, today) => {
    const moved = moveToFuture({ departDate, returnDate }, today);

    return [toDay(moved.departDate), toDay(moved.returnDate)];
  };

  it("leaves a future date alone", () => {
    assert.deepEqual(move("2026-12-10", "2026-12-17", "2026-11-05"), ["2026-12-10", "2026-12-17"]);
  });

  it("leaves a deal that departs today alone", () => {
    assert.deepEqual(move("2026-11-05", "2026-11-10", "2026-11-05"), ["2026-11-05", "2026-11-10"]);
  });

  it("moves a past deal to the next week it can run", () => {
    assert.deepEqual(move("2026-11-04", "2026-11-09", "2026-11-05"), ["2026-11-11", "2026-11-16"]);
  });

  it("lands on today when that's a whole number of weeks away", () => {
    assert.deepEqual(move("2026-10-29", "2026-11-03", "2026-11-05"), ["2026-11-05", "2026-11-10"]);
  });

  it("handles a deal many weeks old, and keeps its day of the week", () => {
    const [departDate] = move("2026-01-01", "2026-01-05", "2026-11-05");

    assert.equal(new Date(departDate).getUTCDay(), new Date("2026-01-01").getUTCDay());
    assert.ok(departDate >= "2026-11-05");
    assert.ok(departDate < "2026-11-12");
  });
});

describe("seeding again", () => {
  it("creates no duplicates", async () => {
    const before = await countRows();

    await seedFlights();

    assert.deepEqual(await countRows(), before);
  });

  it("keeps schedule ids, because offers are built from them", async () => {
    await seedFlights();

    const ids = await prisma.flightSchedule.findMany({ select: { id: true } });

    assert.deepEqual(ids.map(({ id }) => id).sort(), schedules.map(({ id }) => id).sort());
  });

  it("puts a changed schedule back, including its return link", async () => {
    const [{ id, departMinutes, returnScheduleId }] = schedules;

    await prisma.flightSchedule.update({
      where: { id },
      data: { departMinutes: departMinutes + 5, returnScheduleId: null, baseFare: "1.00" },
    });
    await seedFlights();

    const schedule = await prisma.flightSchedule.findUnique({ where: { id } });

    assert.equal(schedule.departMinutes, departMinutes);
    assert.equal(schedule.returnScheduleId, returnScheduleId);
    assert.ok(schedule.baseFare.greaterThan(1));
  });

  it("puts a changed airport and airline back", async () => {
    await prisma.airport.update({ where: { id: "LOS" }, data: { country: "Changed" } });
    await prisma.airline.update({ where: { id: "SB" }, data: { name: "Changed" } });
    await seedFlights();

    const airport = await prisma.airport.findUnique({ where: { id: "LOS" } });
    const airline = await prisma.airline.findUnique({ where: { id: "SB" } });

    assert.equal(airport.country, "Nigeria");
    assert.equal(airline.name, "Skybridge Air");
  });

  it("puts a changed deal back", async () => {
    await prisma.flightDeal.update({ where: { id: "1" }, data: { price: "1.00", isActive: true } });
    await seedFlights();

    const deal = await prisma.flightDeal.findUnique({ where: { id: "1" } });

    assert.equal(deal.price.toNumber(), samples.deals[0].price);
  });

  it("keeps the seats that have been sold", async () => {
    const [{ id: scheduleId }] = schedules;
    const date = new Date("2026-12-10");

    await prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Economy", seatsBooked: 7 } });
    await seedFlights();

    const departure = await prisma.flightDeparture.findUnique({
      where: { scheduleId_date_cabin: { scheduleId, date, cabin: "Economy" } },
    });

    assert.equal(departure.seatsBooked, 7);
  });

  it("leaves other schedules alone", async () => {
    const [{ airlineId, fromAirportId, toAirportId }] = schedules;

    await prisma.flightSchedule.create({
      data: {
        id: "added-later",
        airlineId,
        fromAirportId,
        toAirportId,
        flightNumber: "XX 1",
        aircraft: "Test",
        departMinutes: 0,
        durationMinutes: 60,
        baseFare: "100.00",
        seatsPerCabin: 10,
      },
    });
    await seedFlights();

    const count = await prisma.flightSchedule.count({ where: { id: "added-later" } });

    await prisma.flightSchedule.delete({ where: { id: "added-later" } });

    assert.equal(count, 1);
  });
});
