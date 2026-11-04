import { getCurrentUser } from "../services/auth.service.js";
import { HttpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/token.js";

const readToken = (req) => req.headers.authorization?.replace(/^Bearer /i, "");

const readUser = (token) => {
  try {
    const { sub, role } = verifyToken(token);

    return { id: sub, role };
  } catch {
    throw new HttpError(401, "Your session has expired. Log in again.", "INVALID_TOKEN");
  }
};

export const requireAuth = (req, res, next) => {
  const token = readToken(req);

  if (!token) {
    throw new HttpError(401, "Log in to continue", "AUTH_REQUIRED");
  }

  req.user = readUser(token);
  next();
};

export const optionalAuth = (req, res, next) => {
  const token = readToken(req);

  if (token) {
    req.user = readUser(token);
  }

  next();
};

// Use after requireAuth. The role comes from the database, because a token can outlive a role change.
export const requireAdmin = async (req, res, next) => {
  const { role } = await getCurrentUser(req.user.id);

  if (role !== "ADMIN") {
    throw new HttpError(403, "You don't have access to this", "FORBIDDEN");
  }

  next();
};
