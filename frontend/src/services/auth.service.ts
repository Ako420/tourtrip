import { cookies } from "next/headers";
import { cache } from "react";
import type { AccountUser, AuthResponse, LoginValues, SignupValues } from "@/types";
import { accountClient, isAccountApiEnabled } from "./accountApi";

export const login = async ({ email, password }: LoginValues) => {
  const { data } = await accountClient.post<AuthResponse>("/auth/login", { email, password });

  return data;
};

export const signup = async ({ fullName, email, password }: SignupValues) => {
  const { data } = await accountClient.post<AuthResponse>("/auth/signup", { fullName, email, password });

  return data;
};

// Cached for one request, so the menu and the page share a single call.
export const getCurrentUser = cache(async (): Promise<AccountUser | null> => {
  const token = (await cookies()).get("session")?.value;

  if (!token || !isAccountApiEnabled) {
    return null;
  }

  try {
    const { data } = await accountClient.get<AccountUser>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data;
  } catch {
    // An expired session or a server outage should show a signed-out page, not an error.
    return null;
  }
});
