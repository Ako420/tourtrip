import type { CabinClass, FlightLeg, FlightOffer, FlightSearch } from "@/types";

const airlines = [
  { name: "Skybridge Air", code: "SB", aircraft: "Airbus A350" },
  { name: "Pacific Crest", code: "PC", aircraft: "Boeing 787" },
  { name: "Savanna Air", code: "SV", aircraft: "Airbus A330" },
  { name: "Southern Star", code: "SS", aircraft: "Boeing 777" },
];

const stopCities = ["Dubai", "Istanbul", "Doha", "Frankfurt", "Singapore"];

const cabinMultipliers: Record<CabinClass, number> = {
  Economy: 1,
  "Premium Economy": 1.6,
  Business: 3.2,
  First: 5,
};

const OFFER_COUNT = 15;
const CHILD_FARE_SHARE = 0.75;

const hash = (text: string) => {
  return [...text].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 100_003, 7);
};

const roundToFive = (minutes: number) => minutes - (minutes % 5);

const getBaseFare = (search: FlightSearch) => 90 + (hash(`${search.from}|${search.to}`) % 500);

const getDayFactor = (search: FlightSearch, date: string) => {
  return 1 + ((hash(`${search.from}|${search.to}|${date}`) % 31) - 15) / 100;
};

const getTripPrice = (search: FlightSearch, date: string, factor = 1) => {
  const tripFactor = search.tripType === "round-trip" ? 1.8 : 1;

  return Math.round(getBaseFare(search) * cabinMultipliers[search.cabin] * tripFactor * getDayFactor(search, date) * factor);
};

const getFareFactor = (index: number, stops: number) => {
  const stopDiscount = [1.25, 1, 0.9][stops];

  return stopDiscount * (1 + (index % 5) * 0.06);
};

// The lowest adult fare for a date, used by the date strip.
export const getFareForDate = (search: FlightSearch, date: string) => getTripPrice(search, date, 0.9);

const buildLeg = (from: string, to: string, date: string, index: number, stops: number, offset: number): FlightLeg => {
  const routeHash = hash([from, to].sort().join("|"));
  const departMinutes = (5 * 60 + index * 97 + offset + (routeHash % 60)) % 1440;
  const durationMinutes = 80 + (routeHash % 600) + stops * (110 + index * 10);

  return {
    from,
    to,
    date,
    departMinutes: roundToFive(departMinutes),
    durationMinutes: roundToFive(durationMinutes),
    stops,
    stopCity: stops > 0 ? stopCities[(routeHash + index) % stopCities.length] : undefined,
  };
};

// Builds repeatable sample offers for any route. A real API replaces this.
const buildFlightOffers = (search: FlightSearch): FlightOffer[] => {
  const { from = "", to = "", departDate = "", returnDate, tripType, cabin, adults, children } = search;

  return Array.from({ length: OFFER_COUNT }, (_, index) => {
    const airline = airlines[index % airlines.length];
    const stops = index % 3 === 0 ? 0 : index % 7 === 5 ? 2 : 1;
    const pricePerAdult = getTripPrice(search, departDate, getFareFactor(index, stops));

    return {
      id: `offer-${index + 1}`,
      airline: airline.name,
      flightNumber: `${airline.code} ${100 + (hash(`${from}${to}`) + index * 37) % 800}`,
      aircraft: airline.aircraft,
      outbound: buildLeg(from, to, departDate, index, stops, 0),
      inbound:
        tripType === "round-trip" && returnDate ? buildLeg(to, from, returnDate, index, stops, 145) : undefined,
      cabin,
      checkedBag: index % 2 === 0,
      refundable: index % 4 === 1,
      seatsLeft: index % 6 === 2 ? 3 : undefined,
      pricePerAdult,
      totalPrice: Math.round(pricePerAdult * (adults + children * CHILD_FARE_SHARE)),
      currency: "USD",
    };
  });
};

export default buildFlightOffers;
