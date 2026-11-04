import { Router } from "express";
import { createRoom, getRooms } from "../controllers/room.controller.js";

const router = Router();

router.get("/", getRooms);
router.post("/", createRoom);

export default router;
