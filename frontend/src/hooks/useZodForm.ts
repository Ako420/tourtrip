import {
  startTransition,
  useActionState,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type SubmitEvent,
} from "react";
import { z } from "zod";
import type { FormState } from "@/types";

type FormAction<Result> = (state: FormState<Result>, values: unknown) => Promise<FormState<Result>>;
type FieldErrors = Record<string, string[] | undefined>;

const getValues = (form: HTMLFormElement) => Object.fromEntries(new FormData(form));

// Validates in the browser for instant feedback. The action validates again on the server.
const useZodForm = <Result = unknown>(schema: z.ZodType, action: FormAction<Result>) => {
  const [state, submit, isPending] = useActionState(action, {});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<string[]>([]);

  const validate = (form: HTMLFormElement) => {
    const result = schema.safeParse(getValues(form));

    setErrors(result.success ? {} : z.flattenError(result.error).fieldErrors);

    return result.success;
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    const { name } = event.target;

    if (!name) return;

    setTouched((current) => (current.includes(name) ? current : [...current, name]));
    validate(event.currentTarget);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;

    // Read the form's controls, because unticked checkboxes are left out of FormData.
    const fieldNames = Array.from(form.elements, (element) => element.getAttribute("name") ?? "");

    setTouched(fieldNames.filter(Boolean));

    if (validate(form)) {
      startTransition(() => submit(getValues(form)));
    }
  };

  const getError = (name: string) => {
    return touched.includes(name) ? errors[name]?.[0] : undefined;
  };

  return {
    formProps: {
      // Outside a <dialog> this sends nothing, so a form submitted before the page has loaded can't
      // put a password in the address. A plain POST isn't an option, because it comes back blank.
      method: "dialog",
      noValidate: true,
      onBlur: handleBlur,
      onChange: (event: ChangeEvent<HTMLFormElement>) => validate(event.currentTarget),
      onSubmit: handleSubmit,
    },
    getError,
    isPending,
    message: state.message,
    result: state.result,
  };
};

export default useZodForm;
