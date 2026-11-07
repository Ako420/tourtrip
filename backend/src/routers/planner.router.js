import { Router } from "express";
import { getPlannerSuggestions } from "../controllers/attraction.controller.js";

const router = Router();

router.get("/suggestions", getPlannerSuggestions);

export default router;
