import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { prisma } from "../src/config/db.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const addAirport = (code, city) => prisma.airport.create({ data: { code, city, country: "Somewhere" } });

const addAirline = (code = "SB") => prisma.airline.create({ data: { code, name: "Skybridge Air" } });

const addRoute = async () => {
  const from = await addAirport("LOS", "Lagos");
  const to = await addAirport("LHR", "London");
  const airline = await addAirline();

  return { from, to, airline };
};

const scheduleData = ({ from, to, airline }, overrides = {}) => ({
  airlineId: airline.id,
  flightNumber: "SB 214",
  aircraft: "Airbus A350",
  fromAirportId: from.id,
  toAirportId: to.id,
  departMinutes: 480,
  durationMinutes: 390,
  baseFare: "310.50",
  seatsPerCabin: 40,
  ...overrides,
});

const addSchedule = async (overrides) => prisma.flightSchedule.create({ data: scheduleData(await addRoute(), overrides) });

const dealData = ({ id }, overrides = {}) => ({
  airlineId: id,
  fromCity: "Lagos",
  toCity: "London",
  departDate: new Date("2026-12-10"),
  returnDate: new Date("2026-12-17"),
  cabin: "Economy",
  price: "420.50",
  ...overrides,
});

// A P2002 is Prisma's report of a unique rule being broken.
const assertDuplicate = (attempt) => assert.rejects(attempt, { code: "P2002" });

// A P2003 is Prisma's report of a row that others still point at.
const assertInUse = (attempt) => assert.rejects(attempt, { code: "P2003" });

beforeEach(resetDatabase);
after(closeDatabase);

describe("Airport", () => {
  it("doesn't allow a repeated code", async () => {
    await addAirport("LOS", "Lagos");

    await assertDuplicate(addAirport("LOS", "Abuja"));
  });

  it("doesn't allow a repeated city", async () => {
    await addAirport("LOS", "Lagos");

    await assertDuplicate(addAirport("LAG", "Lagos"));
  });

  it("can't be removed while a schedule uses it", async () => {
    const route = await addRoute();

    await prisma.flightSchedule.create({ data: scheduleData(route) });

    await assertInUse(prisma.airport.delete({ where: { id: route.from.id } }));
    await assertInUse(prisma.airport.delete({ where: { id: route.to.id } }));
  });

  it("lists the schedules in each direction", async () => {
    const route = await addRoute();
    const schedule = await prisma.flightSchedule.create({ data: scheduleData(route) });

    const from = await prisma.airport.findUnique({
      where: { id: route.from.id },
      include: { outgoingSchedules: true, incomingSchedules: true },
    });
    const to = await prisma.airport.findUnique({
      where: { id: route.to.id },
      include: { outgoingSchedules: true, incomingSchedules: true },
    });

    assert.deepEqual(from.outgoingSchedules.map(({ id }) => id), [schedule.id]);
    assert.deepEqual(from.incomingSchedules, []);
    assert.deepEqual(to.incomingSchedules.map(({ id }) => id), [schedule.id]);
    assert.deepEqual(to.outgoingSchedules, []);
  });
});

describe("Airline", () => {
  it("doesn't allow a repeated code", async () => {
    await addAirline("SB");

    await assertDuplicate(addAirline("SB"));
  });

  it("can't be removed while a schedule uses it", async () => {
    const route = await addRoute();

    await prisma.flightSchedule.create({ data: scheduleData(route) });

    await assertInUse(prisma.airline.delete({ where: { id: route.airline.id } }));
  });

  it("can't be removed while a deal uses it", async () => {
    const airline = await addAirline();

    await prisma.flightDeal.create({ data: dealData(airline) });

    await assertInUse(prisma.airline.delete({ where: { id: airline.id } }));
  });
});

describe("FlightSchedule", () => {
  it("fills in its defaults", async () => {
    const schedule = await addSchedule();

    assert.equal(schedule.stops, 0);
    assert.equal(schedule.stopCity, null);
    assert.equal(schedule.checkedBag, false);
    assert.equal(schedule.refundable, false);
    assert.equal(schedule.returnScheduleId, null);
  });

  it("keeps the cents in a fare", async () => {
    const schedule = await addSchedule({ baseFare: "310.55" });

    assert.equal(schedule.baseFare.toFixed(2), "310.55");
  });

  it("stores a stop", async () => {
    const schedule = await addSchedule({ stops: 1, stopCity: "Dubai" });

    assert.equal(schedule.stops, 1);
    assert.equal(schedule.stopCity, "Dubai");
  });

  it("links to its return flight", async () => {
    const route = await addRoute();
    const back = await prisma.flightSchedule.create({
      data: scheduleData(route, { fromAirportId: route.to.id, toAirportId: route.from.id }),
    });
    const out = await prisma.flightSchedule.create({ data: scheduleData(route, { returnScheduleId: back.id }) });

    const found = await prisma.flightSchedule.findUnique({
      where: { id: out.id },
      include: { returnSchedule: true },
    });
    const linked = await prisma.flightSchedule.findUnique({
      where: { id: back.id },
      include: { outboundSchedules: true },
    });

    assert.equal(found.returnSchedule.id, back.id);
    assert.deepEqual(linked.outboundSchedules.map(({ id }) => id), [out.id]);
  });

  it("clears the link when its return flight is removed", async () => {
    const route = await addRoute();
    const back = await prisma.flightSchedule.create({ data: scheduleData(route) });
    const out = await prisma.flightSchedule.create({ data: scheduleData(route, { returnScheduleId: back.id }) });

    await prisma.flightSchedule.delete({ where: { id: back.id } });

    const found = await prisma.flightSchedule.findUnique({ where: { id: out.id } });

    assert.equal(found.returnScheduleId, null);
  });

  it("can link two flights to each other", async () => {
    const route = await addRoute();
    const out = await prisma.flightSchedule.create({ data: scheduleData(route) });
    const back = await prisma.flightSchedule.create({ data: scheduleData(route, { returnScheduleId: out.id }) });

    await prisma.flightSchedule.update({ where: { id: out.id }, data: { returnScheduleId: back.id } });

    const found = await prisma.flightSchedule.findUnique({ where: { id: out.id } });

    assert.equal(found.returnScheduleId, back.id);
  });

  it("has an index for looking up a route", async () => {
    const indexes = await prisma.$queryRaw`SELECT indexdef FROM pg_indexes WHERE tablename = 'FlightSchedule'`;

    assert.ok(indexes.some(({ indexdef }) => indexdef.includes('("fromAirportId", "toAirportId")')));
  });
});

describe("FlightDeparture", () => {
  const date = new Date("2026-12-10");

  it("starts with no seats booked", async () => {
    const { id: scheduleId } = await addSchedule();
    const departure = await prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Economy" } });

    assert.equal(departure.seatsBooked, 0);
  });

  it("stores the date with no time", async () => {
    const { id: scheduleId } = await addSchedule();
    const departure = await prisma.flightDeparture.create({
      data: { scheduleId, date: new Date("2026-12-10T15:30:00Z"), cabin: "Economy" },
    });

    assert.equal(departure.date.toISOString(), "2026-12-10T00:00:00.000Z");
  });

  it("allows one row for each schedule, date and cabin", async () => {
    const { id: scheduleId } = await addSchedule();

    await prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Economy" } });

    await assertDuplicate(prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Economy" } }));
  });

  it("allows another cabin or date on the same schedule", async () => {
    const { id: scheduleId } = await addSchedule();

    await prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Economy" } });
    await prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Business" } });
    await prisma.flightDeparture.create({ data: { scheduleId, date: new Date("2026-12-11"), cabin: "Economy" } });

    assert.equal(await prisma.flightDeparture.count(), 3);
  });

  it("goes when its schedule is removed", async () => {
    const { id: scheduleId } = await addSchedule();

    await prisma.flightDeparture.create({ data: { scheduleId, date, cabin: "Economy" } });
    await prisma.flightSchedule.delete({ where: { id: scheduleId } });

    assert.equal(await prisma.flightDeparture.count(), 0);
  });
});

describe("FlightDeal", () => {
  it("fills in its defaults", async () => {
    const deal = await prisma.flightDeal.create({ data: dealData(await addAirline()) });

    assert.equal(deal.currency, "USD");
    assert.equal(deal.isActive, true);
    assert.equal(deal.isNonstop, false);
  });

  it("keeps the cents in a price", async () => {
    const deal = await prisma.flightDeal.create({ data: dealData(await addAirline(), { price: "420.55" }) });

    assert.equal(deal.price.toFixed(2), "420.55");
  });

  it("stores its dates with no time", async () => {
    const deal = await prisma.flightDeal.create({
      data: dealData(await addAirline(), {
        departDate: new Date("2026-12-10T15:30:00Z"),
        returnDate: new Date("2026-12-17T15:30:00Z"),
      }),
    });

    assert.equal(deal.departDate.toISOString(), "2026-12-10T00:00:00.000Z");
    assert.equal(deal.returnDate.toISOString(), "2026-12-17T00:00:00.000Z");
  });

  it("includes its airline", async () => {
    const airline = await addAirline();
    const { id } = await prisma.flightDeal.create({ data: dealData(airline) });
    const deal = await prisma.flightDeal.findUnique({ where: { id }, include: { airline: true } });

    assert.equal(deal.airline.name, "Skybridge Air");
  });
});
