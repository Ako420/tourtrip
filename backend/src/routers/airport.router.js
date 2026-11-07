import { Router } from "express";
import { getAirports } from "../controllers/flight.controller.js";

const router = Router();

router.get("/", getAirports);

export default router;
