import type { FlightDeal } from "@/types";

const deal = (
  id: string,
  airline: string,
  from: string,
  to: string,
  departDate: string,
  returnDate: string,
  price: number,
  isNonstop = true,
): FlightDeal => {
  return { id, airline, from, to, departDate, returnDate, cabin: "Economy", isNonstop, price, currency: "USD" };
};

// Fictional airlines and fares with the same shape as GET /flights/deals. Used until API_URL is set.
const flightDeals: FlightDeal[] = [
  deal("1", "Skybridge Air", "New York", "Miami", "2026-12-02", "2026-12-05", 229),
  deal("2", "Skybridge Air", "New York", "London", "2026-12-06", "2026-12-16", 805),
  deal("3", "Pacific Crest", "Hong Kong", "Bangkok", "2026-11-16", "2026-11-20", 310),
  deal("4", "Pacific Crest", "Hong Kong", "Tokyo", "2026-11-28", "2026-11-29", 331),
  deal("5", "Savanna Air", "Nairobi", "Dubai", "2026-12-20", "2026-12-28", 433, false),
  deal("6", "Savanna Air", "Lagos", "London", "2026-11-19", "2026-11-25", 638),
  deal("7", "Savanna Air", "Accra", "Paris", "2026-11-24", "2026-12-02", 597, false),
  deal("8", "Southern Star", "Cape Town", "Johannesburg", "2026-11-05", "2026-11-10", 195),
  deal("9", "Southern Star", "Johannesburg", "Dubai", "2026-12-10", "2026-12-18", 512),
  deal("10", "Pacific Crest", "Singapore", "Tokyo", "2026-12-12", "2026-12-19", 420, false),
  deal("11", "Skybridge Air", "London", "New York", "2027-01-08", "2027-01-15", 548),
  deal("12", "Savanna Air", "Lagos", "Nairobi", "2026-12-03", "2026-12-08", 365, false),
];

export default flightDeals;
