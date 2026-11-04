import { rateLimit } from "express-rate-limit";
import { HttpError } from "../utils/httpError.js";

// Every request comes from the Next.js server's IP, so limit by email instead.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.validated.body.email,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new HttpError(429, "Too many failed attempts. Try again later.", "TOO_MANY_ATTEMPTS"));
  },
});
