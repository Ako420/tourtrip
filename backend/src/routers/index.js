import { Router } from "express";
import assistantRouter from "./assistant.router.js";
import authRouter from "./auth.router.js";
import healthRouter from "./health.router.js";
import roomRouter from "./room.router.js";

const router = Router();

router.use("/assistant", assistantRouter);
router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/rooms", roomRouter);

export default router;
