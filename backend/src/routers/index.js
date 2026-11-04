import { Router } from "express";
import healthRouter from "./health.router.js";
import roomRouter from "./room.router.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/rooms", roomRouter);

export default router;
