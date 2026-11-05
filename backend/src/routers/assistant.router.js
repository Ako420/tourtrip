import { Router } from "express";
import { chat } from "../controllers/assistant.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { assistantLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import { assistantChatSchema } from "../validators/assistant.validator.js";

const router = Router();

router.post("/chat", requireAuth, assistantLimiter, validate({ body: assistantChatSchema }), chat);

export default router;
