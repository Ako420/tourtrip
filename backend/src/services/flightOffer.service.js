import { prisma } from "../config/db.js";
import { toFlightOffer } from "../mappers/flight.mapper.js";
import { escapeLike } from "../utils/escapeLike.js";
import { HttpError } from "../utils/httpError.js";
import { getPricePerAdult, getTotalPrice } from "./flightPricing.service.js";

const LOW_SEATS = 5;

const LEG_INCLUDE = { airline: true, fromAirport: true, toAirport: true };
const SCHEDULE_INCLUDE = { ...LEG_INCLUDE, returnSchedule: { include: LEG_INCLUDE } };

const matchCity = (city) => ({ city: { equals: escapeLike(city), mode: "insensitive" } });

const matchRoute = ({ from, to }) => ({ fromAirport: matchCity(from), toAirport: matchCity(to) });

export const getRouteSchedules = async (search) => {
  const schedules = await prisma.flightSchedule.findMany({
    where: {
      ...matchRoute(search),
      returnScheduleId: search.tripType === "round-trip" ? { not: null } : undefined,
    },
    include: SCHEDULE_INCLUDE,
  });

  // Numeric, so LOS-LHR-2 comes before LOS-LHR-10.
  return schedules.toSorted((a, b) => a.id.localeCompare(b.id, "en", { numeric: true }));
};

const getSeatsBooked = async (scheduleIds, date, cabin) => {
  const departures = await prisma.flightDeparture.findMany({
    where: { scheduleId: { in: scheduleIds }, date: new Date(date), cabin },
  });

  return new Map(departures.map(({ scheduleId, seatsBooked }) => [scheduleId, seatsBooked]));
};

const getSeats = (schedule, seatsBooked) => schedule.seatsPerCabin - (seatsBooked.get(schedule.id) ?? 0);

const toOffer = ({ outbound, inbound, seats }, search) => {
  const { departDate, cabin, tripType, adults, children } = search;
  const pricePerAdult = getPricePerAdult({
    baseFare: outbound.baseFare,
    from: outbound.fromAirport.city,
    to: outbound.toAirport.city,
    date: departDate,
    cabin,
    tripType,
  });

  return toFlightOffer({
    outbound,
    inbound,
    search,
    seatsLeft: seats <= LOW_SEATS ? seats : undefined,
    pricePerAdult,
    totalPrice: getTotalPrice(pricePerAdult, adults, children),
  });
};

const getTrips = async (schedules, { departDate, returnDate, tripType, cabin }) => {
  const isRoundTrip = tripType === "round-trip";
  const outboundBooked = await getSeatsBooked(schedules.map(({ id }) => id), departDate, cabin);
  const inboundBooked = isRoundTrip
    ? await getSeatsBooked(schedules.map(({ returnScheduleId }) => returnScheduleId), returnDate, cabin)
    : new Map();

  return schedules.map((outbound) => {
    const inbound = isRoundTrip ? outbound.returnSchedule : undefined;
    const inboundSeats = inbound ? getSeats(inbound, inboundBooked) : Infinity;

    return { outbound, inbound, seats: Math.min(getSeats(outbound, outboundBooked), inboundSeats) };
  });
};

export const buildOffers = async (schedules, search) => {
  const { adults, children, nonstop } = search;
  const trips = await getTrips(schedules, search);

  return trips
    .filter(({ outbound, seats }) => seats >= adults + children && (!nonstop || outbound.stops === 0))
    .map((trip) => toOffer(trip, search));
};

export const getFlightOffers = async (search) => buildOffers(await getRouteSchedules(search), search);

// Skips the seat check, so a flight that has just sold out reaches the booking step and gets a clear answer there.
export const getFlightOffer = async (id, search) => {
  const [outboundId, inboundId, ...rest] = id.split("_");
  const schedule = await prisma.flightSchedule.findFirst({
    where: { id: outboundId, ...matchRoute(search) },
    include: SCHEDULE_INCLUDE,
  });
  const expectedInboundId = search.tripType === "round-trip" ? schedule?.returnScheduleId : undefined;

  if (!schedule || inboundId !== expectedInboundId || rest.length > 0) {
    throw new HttpError(404, "Flight not found", "OFFER_NOT_FOUND");
  }

  const [trip] = await getTrips([schedule], search);

  return toOffer(trip, search);
};
