import type { ComponentProps, ReactNode } from "react";
import Icon from "../ui/Icon";

type FormFieldProps = ComponentProps<"input"> & {
  name: string;
  label: string;
  error?: string;
  endAdornment?: ReactNode;
};

const FormField = ({ name, label, error, endAdornment, ...inputProps }: FormFieldProps) => {
  const errorId = `${name}-error`;

  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-12 w-full rounded-md border px-3 outline-none focus:border-primary ${
            error ? "border-danger" : "border-line"
          } ${endAdornment ? "pr-11" : ""}`}
          {...inputProps}
        />
        {endAdornment}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
          <Icon name="error" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
