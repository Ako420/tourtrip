import * as contentService from "../services/content.service.js";

export const getPageContent = (key) => async (req, res) => {
  res.json(await contentService.getContent(key));
};

export const getLegalDocument = async (req, res) => {
  res.json(await contentService.getLegalDocument(req.validated.params.slug));
};
