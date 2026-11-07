import type { AccountUser, ContactDefaults, RouteParams } from "@/types";

const DEFAULT_NEXT = "/";

// Only same-site paths are allowed, so a crafted link can't send people elsewhere after login.
export const getSafeNext = (value: unknown) => {
  const isSafe = typeof value === "string" && /^\/(?![/\\])/.test(value) && !value.includes("\\");

  return isSafe ? value : DEFAULT_NEXT;
};

export const parseNext = (params: RouteParams) => {
  const value = params.next;

  return getSafeNext(Array.isArray(value) ? value[0] : value);
};

export const getInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;

  return letters.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export const toContactDefaults = (user: AccountUser | null): ContactDefaults | undefined => {
  if (!user) return undefined;

  const [firstName = "", ...rest] = user.fullName.trim().split(/\s+/);

  return { firstName, lastName: rest.join(" "), email: user.email, phone: user.phone ?? "" };
};
