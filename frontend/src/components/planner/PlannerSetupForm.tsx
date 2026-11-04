"use client";

import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { tripStyles } from "@/constants";
import { useToday } from "@/hooks";
import { tripSetupSchema } from "@/schemas";
import type { TripSetup } from "@/types";
import FormField from "../auth/FormField";
import Button from "../ui/Button";

type PlannerSetupFormProps = {
  destinations: string[];
  onCreate: (setup: TripSetup) => void;
};

type FieldErrors = Record<string, string[] | undefined>;

const PlannerSetupForm = ({ destinations, onCreate }: PlannerSetupFormProps) => {
  const today = useToday();
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = Object.fromEntries(new FormData(event.currentTarget));
    const result = tripSetupSchema.safeParse(values);

    if (result.success && today && result.data.startDate < today) {
      setErrors({ startDate: ["Choose a date from today onwards"] });
      return;
    }

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    onCreate(result.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-panel bg-surface p-5 text-ink shadow-card sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <FormField
          name="destination"
          label="Where to?"
          list="planner-destinations"
          autoComplete="off"
          error={errors.destination?.[0]}
        />
        <FormField name="startDate" label="Start date" type="date" min={today ?? undefined} error={errors.startDate?.[0]} />
        <FormField name="endDate" label="End date" type="date" min={today ?? undefined} error={errors.endDate?.[0]} />
      </div>
      <datalist id="planner-destinations">
        {destinations.map((destination) => (
          <option key={destination} value={destination} />
        ))}
      </datalist>

      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-medium">Trip pace</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {tripStyles.map((style) => (
            <label
              key={style.value}
              className="flex cursor-pointer items-center gap-3 rounded-card border border-line p-3 transition-colors duration-300 ease-out has-checked:border-primary has-checked:bg-primary-soft"
            >
              <input
                type="radio"
                name="style"
                value={style.value}
                defaultChecked={style.value === "balanced"}
                className="accent-primary"
              />
              <span>
                <span className="block text-sm font-semibold">{style.label}</span>
                <span className="text-xs text-muted">{style.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto sm:px-10">
        Start planning
      </Button>
    </form>
  );
};

export default PlannerSetupForm;
