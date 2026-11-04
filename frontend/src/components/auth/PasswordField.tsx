"use client";

import { useState, type ComponentProps } from "react";
import Icon from "../ui/Icon";
import FormField from "./FormField";

type PasswordFieldProps = Omit<ComponentProps<typeof FormField>, "type" | "endAdornment">;

const PasswordField = (props: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      {...props}
      type={isVisible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-label={isVisible ? `Hide ${props.label.toLowerCase()}` : `Show ${props.label.toLowerCase()}`}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute inset-y-0 right-0 w-11 text-muted hover:text-ink"
        >
          <Icon name={isVisible ? "eye-slash" : "eye"} />
        </button>
      }
    />
  );
};

export default PasswordField;
