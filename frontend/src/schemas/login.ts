import { z } from "zod";
import { emailField } from "./fields";

const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password"),
});

export default loginSchema;
