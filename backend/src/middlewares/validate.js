import { HttpError } from "../utils/httpError.js";

// Postgres refuses a null byte in text, which would otherwise end in a 500.
const hasNullByte = (value) => {
  if (typeof value === "string") {
    return value.includes("\0");
  }

  return typeof value === "object" && value !== null && Object.values(value).some(hasNullByte);
};

export const validate = (schemas) => (req, res, next) => {
  req.validated ??= {};

  Object.entries(schemas).forEach(([part, schema]) => {
    // A request with no body still reports each missing field by name.
    req.validated[part] = schema.parse(req[part] ?? {});

    if (hasNullByte(req.validated[part])) {
      throw new HttpError(400, "Check your details and try again", "VALIDATION_ERROR");
    }
  });

  next();
};
