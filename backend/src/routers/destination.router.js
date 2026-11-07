import { Router } from "express";
import { getDestinations } from "../controllers/hotel.controller.js";

const router = Router();

router.get("/", getDestinations);

export default router;
