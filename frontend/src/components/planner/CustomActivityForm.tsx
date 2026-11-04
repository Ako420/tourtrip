"use client";

import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { planActivitySchema } from "@/schemas";
import type { PlanActivity } from "@/types";
import FormField from "../auth/FormField";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type CustomActivityFormProps = {
  onAdd: (activity: PlanActivity) => void;
};

type FieldErrors = Record<string, string[] | undefined>;

const CustomActivityForm = ({ onAdd }: CustomActivityFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const result = planActivitySchema.safeParse(Object.fromEntries(new FormData(form)));

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    onAdd(result.data);
    form.reset();
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-dashed border-line p-3 text-sm font-medium text-primary transition-colors duration-300 ease-out hover:bg-primary-soft"
      >
        <Icon name="plus" />
        Add your own activity
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-3 rounded-card border border-line p-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_7rem_7rem]">
        <FormField name="title" label="Activity" autoComplete="off" error={errors.title?.[0]} />
        <FormField name="time" label="Time" type="time" />
        <FormField name="cost" label="Cost" type="number" min={0} inputMode="decimal" error={errors.cost?.[0]} />
      </div>
      <div className="mt-3">
        <FormField name="note" label="Note (optional)" autoComplete="off" error={errors.note?.[0]} />
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm">
          Add to day
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CustomActivityForm;
