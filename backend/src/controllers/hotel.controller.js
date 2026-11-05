import { toAmenity, toHotelDetails, toHotelSummary } from "../mappers/hotel.mapper.js";
import * as hotelService from "../services/hotel.service.js";
import * as hotelSearchService from "../services/hotelSearch.service.js";

export const getHotels = async (req, res) => {
  const hotels = await hotelService.getHotels(req.validated.query);

  res.json(hotels.map(toHotelSummary));
};

export const searchHotels = async (req, res) => {
  const { items, amenities, ...result } = await hotelSearchService.searchHotels(req.validated.query);

  res.json({ items: items.map(toHotelSummary), ...result, amenities: amenities.map(toAmenity) });
};

export const getHotelBySlug = async (req, res) => {
  res.json(toHotelDetails(await hotelService.getHotelBySlug(req.validated.params.slug)));
};

export const getSimilarHotels = async (req, res) => {
  const hotels = await hotelService.getSimilarHotels(req.validated.params.slug);

  res.json(hotels.map(toHotelSummary));
};

export const getDestinations = async (req, res) => {
  res.json(await hotelService.getDestinations());
};
