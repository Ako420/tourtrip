import { Router } from "express";
import { getFlightDeals, searchFlights } from "../controllers/flight.controller.js";
import { validate } from "../middlewares/validate.js";
import { flightDealsSchema, flightSearchSchema } from "../validators/flight.validator.js";

const router = Router();

router.get("/deals", validate({ query: flightDealsSchema }), getFlightDeals);
router.get("/search", validate({ query: flightSearchSchema }), searchFlights);

export default router;
