"use client";

import { signupAction } from "@/actions/auth";
import { useZodForm } from "@/hooks";
import { signupSchema } from "@/schemas";
import TermsCheckbox from "../booking/TermsCheckbox";
import Button from "../ui/Button";
import FormField from "./FormField";
import FormMessage from "./FormMessage";
import PasswordField from "./PasswordField";

type SignupFormProps = {
  next: string;
};

const SignupForm = ({ next }: SignupFormProps) => {
  const { formProps, getError, isPending, message } = useZodForm(signupSchema, (_state, values) =>
    signupAction(next, values),
  );

  return (
    <form {...formProps} className="flex flex-col gap-4">
      <FormMessage message={message} />
      <FormField name="fullName" label="Full name" autoComplete="name" error={getError("fullName")} />
      <FormField name="email" label="Email" type="email" autoComplete="email" error={getError("email")} />
      <PasswordField name="password" label="Password" autoComplete="new-password" error={getError("password")} />
      <PasswordField
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        error={getError("confirmPassword")}
      />
      <TermsCheckbox error={getError("acceptTerms")} />
      <Button type="submit" size="lg" disabled={isPending} className="mt-2 disabled:opacity-60">
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
};

export default SignupForm;
