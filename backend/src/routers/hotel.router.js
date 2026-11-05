import { Router } from "express";
import { getHotelBySlug, getHotels, getSimilarHotels, searchHotels } from "../controllers/hotel.controller.js";
import { validate } from "../middlewares/validate.js";
import { hotelListSchema, hotelParamsSchema, hotelSearchSchema } from "../validators/hotel.validator.js";

const router = Router();

router.get("/", validate({ query: hotelListSchema }), getHotels);
router.get("/search", validate({ query: hotelSearchSchema }), searchHotels);
router.get("/:slug", validate({ params: hotelParamsSchema }), getHotelBySlug);
router.get("/:slug/similar", validate({ params: hotelParamsSchema }), getSimilarHotels);

export default router;
