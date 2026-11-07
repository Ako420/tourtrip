import { cookies } from "next/headers";
import { cache } from "react";
import type { AccountUser, AuthResponse, LoginValues, SignupValues } from "@/types";
import { apiGet, apiPost, isApiLive } from "./http";

// Every page asks for the user, so a slow server shouldn't hold pages up for long.
const CURRENT_USER_TIMEOUT = 5000;

export const login = ({ email, password }: LoginValues) => {
  return apiPost<AuthResponse>("/auth/login", { email, password });
};

export const signup = ({ fullName, email, password }: SignupValues) => {
  return apiPost<AuthResponse>("/auth/signup", { fullName, email, password });
};

// Cached for one request, so the menu and the page share a single call.
export const getCurrentUser = cache(async (): Promise<AccountUser | null> => {
  const token = (await cookies()).get("session")?.value;

  if (!token || !isApiLive("accounts")) {
    return null;
  }

  try {
    return await apiGet<AccountUser>("/auth/me", {}, { auth: true, timeout: CURRENT_USER_TIMEOUT });
  } catch {
    // An expired session or a server outage should show a signed-out page, not an error.
    return null;
  }
});
