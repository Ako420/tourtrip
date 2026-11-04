import type { FlightLeg, SeatClass, TrainOffer, TrainSearch } from "@/types";

export const trainStations = [
  "Abuja",
  "Amsterdam",
  "Barcelona",
  "Brussels",
  "Cape Town",
  "Ibadan",
  "Johannesburg",
  "Kaduna",
  "Kyoto",
  "Lagos",
  "Lisbon",
  "London",
  "Madrid",
  "Milan",
  "Mombasa",
  "Nairobi",
  "Osaka",
  "Paris",
  "Porto",
  "Rome",
  "Tokyo",
];

const operators = [
  { name: "Meridian Rail", code: "MR" },
  { name: "Coastline Express", code: "CE" },
  { name: "Highland Lines", code: "HL" },
];

const changeCities = ["Central Junction", "North Gate", "Riverside", "Union Station"];

const classMultipliers: Record<SeatClass, number> = {
  Standard: 1,
  First: 1.7,
};

const OFFER_COUNT = 12;
const CHILD_FARE_SHARE = 0.5;

const hash = (text: string) => {
  return [...text].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 100_003, 7);
};

const roundToFive = (minutes: number) => minutes - (minutes % 5);

const getDayFactor = (search: TrainSearch, date: string) => {
  return 1 + ((hash(`${search.from}|${search.to}|${date}`) % 31) - 15) / 100;
};

const getTripPrice = (search: TrainSearch, date: string, factor = 1) => {
  const baseFare = 14 + (hash(`${search.from}|${search.to}`) % 80);
  const tripFactor = search.tripType === "round-trip" ? 1.8 : 1;

  return Math.round(baseFare * classMultipliers[search.seatClass] * tripFactor * getDayFactor(search, date) * factor);
};

const getFareFactor = (index: number, changes: number) => {
  return [1.2, 1, 0.9][changes] * (1 + (index % 4) * 0.08);
};

// The lowest adult fare for a date, used by the date strip.
export const getTrainFareForDate = (search: TrainSearch, date: string) => getTripPrice(search, date, 0.9);

const buildLeg = (from: string, to: string, date: string, index: number, changes: number, offset: number): FlightLeg => {
  const routeHash = hash([from, to].sort().join("|"));
  const departMinutes = (5 * 60 + 30 + index * 83 + offset + (routeHash % 60)) % 1440;
  const durationMinutes = 45 + (routeHash % 330) + changes * (40 + index * 5);

  return {
    from,
    to,
    date,
    departMinutes: roundToFive(departMinutes),
    durationMinutes: roundToFive(durationMinutes),
    stops: changes,
    stopCity: changes > 0 ? changeCities[(routeHash + index) % changeCities.length] : undefined,
  };
};

// Builds repeatable sample trains for any route. A real API replaces this.
const buildTrainOffers = (search: TrainSearch): TrainOffer[] => {
  const { from = "", to = "", departDate = "", returnDate, tripType, seatClass, adults, children } = search;

  return Array.from({ length: OFFER_COUNT }, (_, index) => {
    const operator = operators[index % operators.length];
    const changes = index % 2 === 0 ? 0 : index % 5 === 3 ? 2 : 1;
    const pricePerAdult = getTripPrice(search, departDate, getFareFactor(index, changes));

    return {
      id: `train-${index + 1}`,
      operator: operator.name,
      trainNumber: `${operator.code} ${200 + (hash(`${from}${to}`) + index * 41) % 700}`,
      outbound: buildLeg(from, to, departDate, index, changes, 0),
      inbound: tripType === "round-trip" && returnDate ? buildLeg(to, from, returnDate, index, changes, 120) : undefined,
      seatClass,
      refundable: index % 3 === 1,
      seatsLeft: index % 5 === 2 ? 3 : undefined,
      pricePerAdult,
      totalPrice: Math.round(pricePerAdult * (adults + children * CHILD_FARE_SHARE)),
      currency: "USD",
    };
  });
};

export default buildTrainOffers;
