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

// The support form is public, so this stops one address from flooding the team.
export const supportTicketLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => req.validated.body.email,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new HttpError(429, "You have sent a lot of messages. Try again later.", "TOO_MANY_TICKETS"));
  },
});

// Each message costs money, so every signed-in user gets a limit of their own.
export const assistantLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  keyGenerator: (req) => req.user.id,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new HttpError(429, "You have sent a lot of messages. Try again later.", "TOO_MANY_MESSAGES"));
  },
});
