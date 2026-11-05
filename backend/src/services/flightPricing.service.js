import { hash } from "../utils/hash.js";

const CABIN_MULTIPLIERS = {
  Economy: 1,
  "Premium Economy": 1.6,
  Business: 3.2,
  First: 5,
};

const ROUND_TRIP_FACTOR = 1.8;
const CHILD_FARE_SHARE = 0.75;

// Between 0.85 and 1.15, and always the same for a route and date.
export const getDayFactor = (from, to, date) => {
  return 1 + ((hash(`${from}|${to}|${date}`) % 31) - 15) / 100;
};

export const getPricePerAdult = ({ baseFare, from, to, date, cabin, tripType }) => {
  const tripFactor = tripType === "round-trip" ? ROUND_TRIP_FACTOR : 1;

  return Math.round(Number(baseFare) * CABIN_MULTIPLIERS[cabin] * tripFactor * getDayFactor(from, to, date));
};

export const getTotalPrice = (pricePerAdult, adults, children) => {
  return Math.round(pricePerAdult * (adults + children * CHILD_FARE_SHARE));
};
