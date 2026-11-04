import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { HttpError } from "../utils/httpError.js";
import { signToken } from "../utils/token.js";

const SALT_ROUNDS = 12;

// A hash of a random value. Checking it for unknown emails makes them take as long as real ones.
const UNKNOWN_USER_HASH = "$2b$12$wsKHjL8kvdzdUDxrPU4Q/.SAijOgg3W.2EPjFwmulSZfDzBLpb8De";

export const signup = async ({ fullName, email, password }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { fullName, email, passwordHash } });

  return signToken(user);
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  const isMatch = await bcrypt.compare(password, user?.passwordHash ?? UNKNOWN_USER_HASH);

  if (!user || !isMatch) {
    throw new HttpError(401, "Incorrect email or password", "INVALID_CREDENTIALS");
  }

  return signToken(user);
};

export const getCurrentUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true, role: true },
  });

  // A valid token can outlive its account.
  if (!user) {
    throw new HttpError(401, "Your session has expired. Log in again.", "INVALID_TOKEN");
  }

  return user;
};
