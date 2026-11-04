"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/schemas";
import { ApiError, isApiEnabled, login, signup } from "@/services";
import type { AuthResponse, FormState } from "@/types";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const startSession = async (
  request: () => Promise<AuthResponse>,
  errorMessages: Record<number, string>,
): Promise<FormState> => {
  if (!isApiEnabled) {
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

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/");
};

export const loginAction = async (_state: FormState, values: unknown): Promise<FormState> => {
  const result = loginSchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  return startSession(() => login(result.data), {
    401: "Incorrect email or password.",
  });
};

export const signupAction = async (_state: FormState, values: unknown): Promise<FormState> => {
  const result = signupSchema.safeParse(values);

  if (!result.success) {
    return { message: "Check your details and try again." };
  }

  return startSession(() => signup(result.data), {
    409: "An account with this email already exists.",
  });
};
