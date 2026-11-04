import { Router } from "express";
import { getMe, login, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { loginLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), signup);
router.post("/login", validate({ body: loginSchema }), loginLimiter, login);
router.get("/me", requireAuth, getMe);

export default router;
