import { Router } from "express";
import authRouter from "./auth.router.js";
import healthRouter from "./health.router.js";
import roomRouter from "./room.router.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/rooms", roomRouter);

export default router;
