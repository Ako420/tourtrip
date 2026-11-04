import { z } from "zod";

const emailField = z
  .string("Enter your email address")
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

// bcrypt only reads the first 72 bytes, and some characters take more than one byte.
const newPasswordField = z
  .string("Enter a password")
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must include a letter")
  .regex(/[0-9]/, "Password must include a number")
  .refine((value) => Buffer.byteLength(value) <= 72, "Password must be 72 characters or fewer");

export const signupSchema = z.object({
  fullName: z
    .string("Enter your full name")
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Name must be 100 characters or fewer"),
  email: emailField,
  password: newPasswordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string("Enter your password").min(1, "Enter your password"),
});
