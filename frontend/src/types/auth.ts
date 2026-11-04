import type { z } from "zod";
import type { loginSchema, signupSchema } from "@/schemas";

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

export type AuthResponse = {
  token: string;
};

export type FormState<Result = unknown> = {
  message?: string;
  result?: Result;
};
