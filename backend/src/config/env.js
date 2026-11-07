import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"], "must be development, test or production")
    .default("development"),
  PORT: z.coerce
    .number("must be a number")
    .int("must be a whole number")
    .min(1, "must be 1 or higher")
    .max(65535, "must be 65535 or lower")
    .default(5000),
  DATABASE_URL: z.url("is required and must be a valid URL"),
  JWT_SECRET: z.string("is required").min(32, "must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().min(1, "cannot be empty").default("7d"),
  CLOUDINARY_CLOUD_NAME: z.string("is required").min(1, "is required"),
  CLOUDINARY_API_KEY: z.string("is required").min(1, "is required"),
  CLOUDINARY_API_SECRET: z.string("is required").min(1, "is required"),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:");

  result.error.issues.forEach(({ path, message }) => {
    console.error(`  ${path.join(".")} ${message}`);
  });

  process.exit(1);
}

export const env = result.data;
