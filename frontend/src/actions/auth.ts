"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeNext } from "@/lib";
import { loginSchema, signupSchema } from "@/schemas";
import { ApiError, isApiLive, login, signup } from "@/services";
import type { AuthResponse, FormState } from "@/types";

const SESSION_COOKIE = "session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const startSession = async (
  request: () => Promise<AuthResponse>,
  errorMessages: Record<number, string>,
  next: unknown,
): Promise<FormState> => {
  if (!isApiLive("accounts")) {
    return { message: "Accounts are not connected to the server yet." };
  }

  let token: string;

  try {
    ({ token } = await request());
  } catch (error) {
    const message = error instanceof ApiError ? errorMessages[error.status] : undefined;

    return { message: message ?? "Something went wrong. Please try again." };
  }

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(getSafeNext(next));
};

export const loginAction = async (next: unknown, values: unknown): Promise<FormState> => {
  const result = loginSchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  return startSession(
    () => login(result.data),
    {
      401: "Incorrect email or password.",
      429: "Too many failed attempts. Try again later.",
    },
    next,
  );
};

export const signupAction = async (next: unknown, values: unknown): Promise<FormState> => {
  const result = signupSchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  return startSession(
    () => signup(result.data),
    {
      400: "Check your details and try again.",
      409: "An account with this email already exists.",
    },
    next,
  );
};

export const logoutAction = async () => {
  (await cookies()).delete(SESSION_COOKIE);

  redirect("/");
};
