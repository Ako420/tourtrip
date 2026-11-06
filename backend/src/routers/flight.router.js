import { Router } from "express";
import { getFlightDeals, getFlightOffer, searchFlights } from "../controllers/flight.controller.js";
import { validate } from "../middlewares/validate.js";
import { flightDealsSchema, flightOfferParamsSchema, flightSearchSchema } from "../validators/flight.validator.js";

const router = Router();

router.get("/deals", validate({ query: flightDealsSchema }), getFlightDeals);
router.get("/search", validate({ query: flightSearchSchema }), searchFlights);
router.get("/offers/:id", validate({ params: flightOfferParamsSchema, query: flightSearchSchema }), getFlightOffer);

export default router;
