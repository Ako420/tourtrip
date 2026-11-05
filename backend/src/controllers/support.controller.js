import * as supportService from "../services/support.service.js";

export const getFaqs = async (req, res) => {
  res.json(await supportService.getFaqs());
};

export const createTicket = async (req, res) => {
  res.status(201).json(await supportService.createTicket(req.validated.body, req.user?.id));
};
