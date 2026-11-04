"use client";

import { loginAction } from "@/actions/auth";
import { useZodForm } from "@/hooks";
import { loginSchema } from "@/schemas";
import Button from "../ui/Button";
import FormField from "./FormField";
import FormMessage from "./FormMessage";
import PasswordField from "./PasswordField";

const LoginForm = () => {
  const { formProps, getError, isPending, message } = useZodForm(loginSchema, loginAction);

  return (
    <form {...formProps} className="flex flex-col gap-4">
      <FormMessage message={message} />
      <FormField name="email" label="Email" type="email" autoComplete="email" error={getError("email")} />
      <PasswordField name="password" label="Password" autoComplete="current-password" error={getError("password")} />
      <Button type="submit" size="lg" disabled={isPending} className="mt-2 disabled:opacity-60">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
