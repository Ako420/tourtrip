import assert from "node:assert/strict";
import { after, beforeEach, describe, it } from "node:test";
import { prisma } from "../src/config/db.js";
import { closeDatabase, resetDatabase } from "./helpers.js";

const addStation = (name) => prisma.station.create({ data: { name } });

const addOperator = (code = "MR") => prisma.trainOperator.create({ data: { code, name: "Meridian Rail" } });

const addRoute = async () => {
  const from = await addStation("London");
  const to = await addStation("Paris");
  const operator = await addOperator();

  return { from, to, operator };
};

const scheduleData = ({ from, to, operator }, overrides = {}) => ({
  operatorId: operator.id,
  trainNumber: "MR 214",
  fromStationId: from.id,
  toStationId: to.id,
  departMinutes: 480,
  durationMinutes: 150,
  baseFare: "42.50",
  seatsPerClass: 60,
  ...overrides,
});

const addSchedule = async (overrides) => prisma.trainSchedule.create({ data: scheduleData(await addRoute(), overrides) });

// A P2002 is Prisma's report of a unique rule being broken.
const assertDuplicate = (attempt) => assert.rejects(attempt, { code: "P2002" });

// A P2003 is Prisma's report of a row that others still point at.
const assertInUse = (attempt) => assert.rejects(attempt, { code: "P2003" });

beforeEach(resetDatabase);
after(closeDatabase);

describe("Station", () => {
  it("doesn't allow a repeated name", async () => {
    await addStation("London");

    await assertDuplicate(addStation("London"));
  });

  it("can't be removed while a schedule uses it", async () => {
    const route = await addRoute();

    await prisma.trainSchedule.create({ data: scheduleData(route) });

    await assertInUse(prisma.station.delete({ where: { id: route.from.id } }));
    await assertInUse(prisma.station.delete({ where: { id: route.to.id } }));
  });

  it("lists the schedules in each direction", async () => {
    const route = await addRoute();
    const schedule = await prisma.trainSchedule.create({ data: scheduleData(route) });

    const from = await prisma.station.findUnique({
      where: { id: route.from.id },
      include: { outgoingSchedules: true, incomingSchedules: true },
    });
    const to = await prisma.station.findUnique({
      where: { id: route.to.id },
      include: { outgoingSchedules: true, incomingSchedules: true },
    });

    assert.deepEqual(from.outgoingSchedules.map(({ id }) => id), [schedule.id]);
    assert.deepEqual(from.incomingSchedules, []);
    assert.deepEqual(to.incomingSchedules.map(({ id }) => id), [schedule.id]);
    assert.deepEqual(to.outgoingSchedules, []);
  });
});

describe("TrainOperator", () => {
  it("doesn't allow a repeated code", async () => {
    await addOperator("MR");

    await assertDuplicate(addOperator("MR"));
  });

  it("can't be removed while a schedule uses it", async () => {
    const route = await addRoute();

    await prisma.trainSchedule.create({ data: scheduleData(route) });

    await assertInUse(prisma.trainOperator.delete({ where: { id: route.operator.id } }));
  });
});

describe("TrainSchedule", () => {
  it("fills in its defaults", async () => {
    const schedule = await addSchedule();

    assert.equal(schedule.changes, 0);
    assert.equal(schedule.changeCity, null);
    assert.equal(schedule.refundable, false);
    assert.equal(schedule.returnScheduleId, null);
  });

  it("keeps the cents in a fare", async () => {
    const schedule = await addSchedule({ baseFare: "42.55" });

    assert.equal(schedule.baseFare.toFixed(2), "42.55");
  });

  it("stores a change", async () => {
    const schedule = await addSchedule({ changes: 1, changeCity: "Central Junction" });

    assert.equal(schedule.changes, 1);
    assert.equal(schedule.changeCity, "Central Junction");
  });

  it("links to its return train", async () => {
    const route = await addRoute();
    const back = await prisma.trainSchedule.create({
      data: scheduleData(route, { fromStationId: route.to.id, toStationId: route.from.id }),
    });
    const out = await prisma.trainSchedule.create({ data: scheduleData(route, { returnScheduleId: back.id }) });

    const found = await prisma.trainSchedule.findUnique({
      where: { id: out.id },
      include: { returnSchedule: true },
    });
    const linked = await prisma.trainSchedule.findUnique({
      where: { id: back.id },
      include: { outboundSchedules: true },
    });

    assert.equal(found.returnSchedule.id, back.id);
    assert.deepEqual(linked.outboundSchedules.map(({ id }) => id), [out.id]);
  });

  it("clears the link when its return train is removed", async () => {
    const route = await addRoute();
    const back = await prisma.trainSchedule.create({ data: scheduleData(route) });
    const out = await prisma.trainSchedule.create({ data: scheduleData(route, { returnScheduleId: back.id }) });

    await prisma.trainSchedule.delete({ where: { id: back.id } });

    const found = await prisma.trainSchedule.findUnique({ where: { id: out.id } });

    assert.equal(found.returnScheduleId, null);
  });

  it("can link two trains to each other", async () => {
    const route = await addRoute();
    const out = await prisma.trainSchedule.create({ data: scheduleData(route) });
    const back = await prisma.trainSchedule.create({ data: scheduleData(route, { returnScheduleId: out.id }) });

    await prisma.trainSchedule.update({ where: { id: out.id }, data: { returnScheduleId: back.id } });

    const found = await prisma.trainSchedule.findUnique({ where: { id: out.id } });

    assert.equal(found.returnScheduleId, back.id);
  });

  it("has an index for looking up a route", async () => {
    const indexes = await prisma.$queryRaw`SELECT indexdef FROM pg_indexes WHERE tablename = 'TrainSchedule'`;

    assert.ok(indexes.some(({ indexdef }) => indexdef.includes('("fromStationId", "toStationId")')));
  });
});

describe("TrainDeparture", () => {
  const date = new Date("2026-12-10");

  it("starts with no seats booked", async () => {
    const { id: scheduleId } = await addSchedule();
    const departure = await prisma.trainDeparture.create({ data: { scheduleId, date, seatClass: "Standard" } });

    assert.equal(departure.seatsBooked, 0);
  });

  it("stores the date with no time", async () => {
    const { id: scheduleId } = await addSchedule();
    const departure = await prisma.trainDeparture.create({
      data: { scheduleId, date: new Date("2026-12-10T15:30:00Z"), seatClass: "Standard" },
    });

    assert.equal(departure.date.toISOString(), "2026-12-10T00:00:00.000Z");
  });

  it("allows one row for each schedule, date and class", async () => {
    const { id: scheduleId } = await addSchedule();

    await prisma.trainDeparture.create({ data: { scheduleId, date, seatClass: "Standard" } });

    await assertDuplicate(prisma.trainDeparture.create({ data: { scheduleId, date, seatClass: "Standard" } }));
  });

  it("allows another class or date on the same schedule", async () => {
    const { id: scheduleId } = await addSchedule();

    await prisma.trainDeparture.create({ data: { scheduleId, date, seatClass: "Standard" } });
    await prisma.trainDeparture.create({ data: { scheduleId, date, seatClass: "First" } });
    await prisma.trainDeparture.create({ data: { scheduleId, date: new Date("2026-12-11"), seatClass: "Standard" } });

    assert.equal(await prisma.trainDeparture.count(), 3);
  });

  it("goes when its schedule is removed", async () => {
    const { id: scheduleId } = await addSchedule();

    await prisma.trainDeparture.create({ data: { scheduleId, date, seatClass: "Standard" } });
    await prisma.trainSchedule.delete({ where: { id: scheduleId } });

    assert.equal(await prisma.trainDeparture.count(), 0);
  });
});
