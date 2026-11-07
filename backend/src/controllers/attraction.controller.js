import { toAttraction, toAttractionDetails, toPlannerSuggestion } from "../mappers/attraction.mapper.js";
import * as attractionService from "../services/attraction.service.js";

export const searchAttractions = async (req, res) => {
  const { items, ...result } = await attractionService.searchAttractions(req.validated.query);

  res.json({ items: items.map(toAttraction), ...result });
};

export const getAttractionBySlug = async (req, res) => {
  res.json(toAttractionDetails(await attractionService.getAttractionBySlug(req.validated.params.slug)));
};

export const getSimilarAttractions = async (req, res) => {
  const attractions = await attractionService.getSimilarAttractions(req.validated.params.slug);

  res.json(attractions.map(toAttraction));
};

export const getPlannerSuggestions = async (req, res) => {
  const attractions = await attractionService.getPlannerSuggestions();

  res.json(attractions.map(toPlannerSuggestion));
};
