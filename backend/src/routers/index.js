import { Router } from "express";
import adminRouter from "./admin.router.js";
import assistantRouter from "./assistant.router.js";
import authRouter from "./auth.router.js";
import destinationRouter from "./destination.router.js";
import healthRouter from "./health.router.js";
import hotelRouter from "./hotel.router.js";

const router = Router();

router.use("/admin", adminRouter);
router.use("/assistant", assistantRouter);
router.use("/auth", authRouter);
router.use("/destinations", destinationRouter);
router.use("/health", healthRouter);
router.use("/hotels", hotelRouter);

export default router;
