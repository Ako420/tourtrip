import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signToken = ({ id, role }) => {
  return jwt.sign({ role }, env.JWT_SECRET, { subject: id, expiresIn: env.JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });
};
