import { Router } from "express";
import { getAttractionBySlug, getSimilarAttractions, searchAttractions } from "../controllers/attraction.controller.js";
import { validate } from "../middlewares/validate.js";
import { attractionParamsSchema, attractionSearchSchema } from "../validators/attraction.validator.js";

const router = Router();

router.get("/search", validate({ query: attractionSearchSchema }), searchAttractions);
router.get("/:slug", validate({ params: attractionParamsSchema }), getAttractionBySlug);
router.get("/:slug/similar", validate({ params: attractionParamsSchema }), getSimilarAttractions);

export default router;
