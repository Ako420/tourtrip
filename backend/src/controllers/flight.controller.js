import { toFlightDeal } from "../mappers/flight.mapper.js";
import * as flightService from "../services/flight.service.js";
import * as flightSearchService from "../services/flightSearch.service.js";

export const getAirports = async (req, res) => {
  res.json(await flightService.getAirports());
};

export const getFlightDeals = async (req, res) => {
  const deals = await flightService.getFlightDeals(req.validated.query);

  res.json(deals.map(toFlightDeal));
};

export const searchFlights = async (req, res) => {
  res.json(await flightSearchService.searchFlights(req.validated.query));
};
