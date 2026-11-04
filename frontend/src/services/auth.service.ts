import type { AuthResponse, LoginValues, SignupValues } from "@/types";
import { apiPost } from "./http";

export const login = (values: LoginValues) => {
  return apiPost<AuthResponse>("/auth/login", values);
};

export const signup = ({ fullName, email, password }: SignupValues) => {
  return apiPost<AuthResponse>("/auth/signup", { fullName, email, password });
};
