import { ZodError } from "zod";
import { HttpError } from "../utils/httpError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Check your details and try again",
      code: "VALIDATION_ERROR",
      errors: err.issues.map(({ path, message }) => ({ path: path.join("."), message })),
    });
  }

  // Prisma unique constraint violation
  if (err.code === "P2002") {
    return res.status(409).json({ message: "Record already exists", code: "ALREADY_EXISTS" });
  }

  // Prisma record not found
  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found", code: "NOT_FOUND" });
  }

  const status = err.status || 500;

  if (status >= 500) {
    console.error(err);
    return res.status(status).json({ message: "Internal server error", code: "INTERNAL_ERROR" });
  }

  const code = err instanceof HttpError ? err.code : "REQUEST_ERROR";

  res.status(status).json({ message: err.message, code });
};
