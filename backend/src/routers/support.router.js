import { Router } from "express";
import { createTicket, getFaqs } from "../controllers/support.controller.js";
import { optionalAuth } from "../middlewares/auth.js";
import { supportTicketLimiter } from "../middlewares/rateLimit.js";
import { validate } from "../middlewares/validate.js";
import { supportTicketSchema } from "../validators/support.validator.js";

const router = Router();

router.get("/faqs", getFaqs);
router.post("/tickets", optionalAuth, validate({ body: supportTicketSchema }), supportTicketLimiter, createTicket);

export default router;
