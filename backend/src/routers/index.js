import { Router } from "express";
import adminRouter from "./admin.router.js";
import airportRouter from "./airport.router.js";
import assistantRouter from "./assistant.router.js";
import attractionRouter from "./attraction.router.js";
import authRouter from "./auth.router.js";
import contentRouter from "./content.router.js";
import destinationRouter from "./destination.router.js";
import flightRouter from "./flight.router.js";
import healthRouter from "./health.router.js";
import hotelRouter from "./hotel.router.js";
import plannerRouter from "./planner.router.js";
import supportRouter from "./support.router.js";

const router = Router();

// First, so "content" in a path such as /flights/content isn't read as a :slug.
router.use(contentRouter);
router.use("/admin", adminRouter);
router.use("/airports", airportRouter);
router.use("/assistant", assistantRouter);
router.use("/attractions", attractionRouter);
router.use("/auth", authRouter);
router.use("/destinations", destinationRouter);
router.use("/flights", flightRouter);
router.use("/health", healthRouter);
router.use("/hotels", hotelRouter);
router.use("/planner", plannerRouter);
router.use("/support", supportRouter);

export default router;
