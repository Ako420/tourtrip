import { toMoney } from "../utils/money.js";

export const CURRENCY = "USD";

const toDateText = (date) => date.toISOString().slice(0, 10);

const toFlightLeg = (schedule, date) => {
  const { fromAirport, toAirport, departMinutes, durationMinutes, stops, stopCity } = schedule;

  return {
    from: fromAirport.city,
    to: toAirport.city,
    date,
    departMinutes,
    durationMinutes,
    stops,
    stopCity: stopCity ?? undefined,
  };
};

export const toFlightOffer = ({ outbound, inbound, search, seatsLeft, pricePerAdult, totalPrice }) => {
  const { id, airline, flightNumber, aircraft, checkedBag, refundable } = outbound;

  return {
    id: inbound ? `${id}_${inbound.id}` : id,
    airline: airline.name,
    flightNumber,
    aircraft,
    outbound: toFlightLeg(outbound, search.departDate),
    inbound: inbound ? toFlightLeg(inbound, search.returnDate) : undefined,
    cabin: search.cabin,
    checkedBag,
    refundable,
    seatsLeft,
    pricePerAdult,
    totalPrice,
    currency: CURRENCY,
  };
};

export const toFlightDeal = (deal) => {
  const { id, airline, fromCity, toCity, departDate, returnDate, cabin, isNonstop, price, currency } = deal;

  return {
    id,
    airline: airline.name,
    from: fromCity,
    to: toCity,
    departDate: toDateText(departDate),
    returnDate: toDateText(returnDate),
    cabin,
    isNonstop,
    price: toMoney(price),
    currency,
  };
};
