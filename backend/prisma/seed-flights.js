import { readFileSync } from "node:fs";
import { prisma } from "../src/config/db.js";
import { hash } from "../src/utils/hash.js";

const SAMPLE_FLIGHTS = new URL("./seed-data/flights.json", import.meta.url);

const SCHEDULES_PER_ROUTE = 15;
const SEATS_PER_CABIN = 40;
const SEATS_ON_SMALL_FLIGHTS = 3;
const MINUTES_IN_A_DAY = 1440;
const DAYS_IN_A_WEEK = 7;
const DAY_IN_MS = 86_400_000;

// The next few functions repeat the frontend's sample logic, so times and fares look the same as its offers.
const roundToFive = (minutes) => minutes - (minutes % 5);

const getStops = (index) => {
  if (index % 3 === 0) {
    return 0;
  }

  return index % 7 === 5 ? 2 : 1;
};

const getBaseFare = (from, to, index, stops) => {
  const routeFare = 90 + (hash(`${from.city}|${to.city}`) % 500);
  const stopDiscount = [1.25, 1, 0.9][stops];

  return (routeFare * stopDiscount * (1 + (index % 5) * 0.06)).toFixed(2);
};

// The sample could stop at the flight's own origin or destination, so those cities move on to the next one.
const getStopCity = (from, to, stopCities, routeHash, index) => {
  let position = routeHash + index;

  while ([from.city, to.city].includes(stopCities[position % stopCities.length])) {
    position += 1;
  }

  return stopCities[position % stopCities.length];
};

const toScheduleId = (from, to, index) => `${from.code}-${to.code}-${index + 1}`;

const toSchedule = (from, to, airlines, stopCities, index) => {
  const airline = airlines[index % airlines.length];
  const stops = getStops(index);
  const routeHash = hash([from.city, to.city].sort().join("|"));
  const numberHash = hash(`${from.city}${to.city}`);

  return {
    id: toScheduleId(from, to, index),
    airlineId: airline.code,
    flightNumber: `${airline.code} ${100 + ((numberHash + index * 37) % 800)}`,
    aircraft: airline.aircraft,
    fromAirportId: from.code,
    toAirportId: to.code,
    departMinutes: roundToFive((5 * 60 + index * 97 + (routeHash % 60)) % MINUTES_IN_A_DAY),
    durationMinutes: roundToFive(80 + (routeHash % 600) + stops * (110 + index * 10)),
    stops,
    stopCity: stops > 0 ? getStopCity(from, to, stopCities, routeHash, index) : null,
    baseFare: getBaseFare(from, to, index, stops),
    checkedBag: index % 2 === 0,
    refundable: index % 4 === 1,
    seatsPerCabin: index % 6 === 2 ? SEATS_ON_SMALL_FLIGHTS : SEATS_PER_CABIN,
  };
};

const buildSchedules = ({ airports, airlines, stopCities }) => {
  return airports.flatMap((from) => {
    return airports
      .filter((to) => to.code !== from.code)
      .flatMap((to) => {
        return Array.from({ length: SCHEDULES_PER_ROUTE }, (_, index) => {
          return {
            ...toSchedule(from, to, airlines, stopCities, index),
            returnScheduleId: toScheduleId(to, from, index),
          };
        });
      });
  });
};

// One statement, because a flight and its return each need the other to exist, and Postgres checks that when the
// statement ends. It updates rows and never removes them, so FlightDeparture keeps the seats that have been sold.
const saveSchedules = (schedules) => {
  return prisma.$executeRaw`
    INSERT INTO "FlightSchedule" (
      "id", "airlineId", "flightNumber", "aircraft", "fromAirportId", "toAirportId", "departMinutes", "durationMinutes",
      "stops", "stopCity", "baseFare", "checkedBag", "refundable", "seatsPerCabin", "returnScheduleId", "updatedAt"
    )
    SELECT *, now() FROM jsonb_to_recordset(${JSON.stringify(schedules)}::jsonb) AS schedule(
      "id" text, "airlineId" text, "flightNumber" text, "aircraft" text, "fromAirportId" text, "toAirportId" text,
      "departMinutes" int, "durationMinutes" int, "stops" int, "stopCity" text, "baseFare" numeric, "checkedBag" boolean,
      "refundable" boolean, "seatsPerCabin" int, "returnScheduleId" text
    )
    ON CONFLICT ("id") DO UPDATE SET
      "airlineId" = excluded."airlineId",
      "flightNumber" = excluded."flightNumber",
      "aircraft" = excluded."aircraft",
      "fromAirportId" = excluded."fromAirportId",
      "toAirportId" = excluded."toAirportId",
      "departMinutes" = excluded."departMinutes",
      "durationMinutes" = excluded."durationMinutes",
      "stops" = excluded."stops",
      "stopCity" = excluded."stopCity",
      "baseFare" = excluded."baseFare",
      "checkedBag" = excluded."checkedBag",
      "refundable" = excluded."refundable",
      "seatsPerCabin" = excluded."seatsPerCabin",
      "returnScheduleId" = excluded."returnScheduleId",
      "updatedAt" = excluded."updatedAt"
  `;
};

// Moved by whole weeks, so a deal keeps its length and its days of the week.
export const moveToFuture = (deal, today) => {
  const [departTime, returnTime, todayTime] = [deal.departDate, deal.returnDate, today].map((date) => Date.parse(date));
  const weeks = Math.ceil((todayTime - departTime) / (DAY_IN_MS * DAYS_IN_A_WEEK));
  const shift = Math.max(weeks, 0) * DAY_IN_MS * DAYS_IN_A_WEEK;

  return { departDate: new Date(departTime + shift), returnDate: new Date(returnTime + shift) };
};

const toDeal = ({ id, airline, from, to, departDate, returnDate, ...deal }, airlines, today) => {
  const { code } = airlines.find(({ name }) => name === airline);

  return {
    ...deal,
    ...moveToFuture({ departDate, returnDate }, today),
    airlineId: code,
    fromCity: from,
    toCity: to,
  };
};

export const seedFlights = async () => {
  const flights = JSON.parse(readFileSync(SAMPLE_FLIGHTS, "utf8"));
  const { airports, airlines, deals } = flights;
  const today = new Date().toISOString().slice(0, 10);
  const schedules = buildSchedules(flights);

  for (const { code, ...airport } of airports) {
    await prisma.airport.upsert({ where: { id: code }, update: airport, create: { ...airport, id: code, code } });
  }

  for (const { code, name } of airlines) {
    await prisma.airline.upsert({ where: { id: code }, update: { name }, create: { id: code, code, name } });
  }

  await saveSchedules(schedules);

  for (const deal of deals) {
    const data = toDeal(deal, airlines, today);

    await prisma.flightDeal.upsert({ where: { id: deal.id }, update: data, create: { ...data, id: deal.id } });
  }

  console.log(`Seeded ${airports.length} airports, ${schedules.length} flight schedules and ${deals.length} deals`);
};
