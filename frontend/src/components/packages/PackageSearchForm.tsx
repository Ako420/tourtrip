"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { PACKAGE_NIGHTS } from "@/constants";
import { useToday } from "@/hooks";
import { addDays, toPackageQuery } from "@/lib";
import { packageSearchSchema } from "@/schemas";
import type { PackageSearch } from "@/types";
import DateField from "../search/DateField";
import PackagePicker from "../search/PackagePicker";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type PackageSearchFormProps = {
  initialValues: PackageSearch;
  airports: string[];
  destinations: string[];
};

type FieldErrors = Record<string, string[] | undefined>;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return <p className="px-4 pb-2 text-left text-sm text-danger">{message}</p>;
};

const PackageSearchForm = ({ initialValues, airports, destinations }: PackageSearchFormProps) => {
  const router = useRouter();
  const today = useToday();

  const [from, setFrom] = useState(initialValues.from ?? "");
  const [to, setTo] = useState(initialValues.to ?? "");
  const [selectedDepart, setSelectedDepart] = useState(initialValues.departDate);
  const [selectedReturn, setSelectedReturn] = useState(initialValues.returnDate);
  const [travelers, setTravelers] = useState({
    rooms: initialValues.rooms,
    adults: initialValues.adults,
    children: initialValues.children,
    cabin: initialValues.cabin,
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const departDate = selectedDepart ?? (today ? addDays(today, 7) : undefined);
  const returnDate = selectedReturn ?? (departDate && addDays(departDate, PACKAGE_NIGHTS));

  const handleDepartChange = (value: string) => {
    setSelectedDepart(value);

    if (returnDate && returnDate <= value) {
      setSelectedReturn(addDays(value, PACKAGE_NIGHTS));
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = packageSearchSchema.safeParse({ from, to, departDate: departDate ?? "", returnDate: returnDate ?? "" });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    router.push(`/packages/results?${toPackageQuery({ ...result.data, ...travelers })}`);
  };

  return (
    <form onSubmit={handleSubmit} role="search" noValidate className="rounded-panel bg-surface p-4 text-ink shadow-card sm:p-5">
      <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <div className="rounded-card border border-line sm:grid sm:grid-cols-2">
          <div className="border-b border-line sm:border-r sm:border-b-0">
            <label className="flex h-14 items-center gap-3 px-4">
              <Icon name="plane" className="-rotate-45 text-ink-soft" />
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="Leaving from"
                aria-label="Leaving from"
                aria-invalid={Boolean(errors.from)}
                list="package-from-options"
                className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
              />
            </label>
            <FieldError message={errors.from?.[0]} />
          </div>
          <div>
            <label className="flex h-14 items-center gap-3 px-4">
              <Icon name="location" className="text-ink-soft" />
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="Going to"
                aria-label="Going to"
                aria-invalid={Boolean(errors.to)}
                list="package-to-options"
                className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
              />
            </label>
            <FieldError message={errors.to?.[0]} />
          </div>
          <datalist id="package-from-options">
            {airports.map((airport) => (
              <option key={airport} value={airport} />
            ))}
          </datalist>
          <datalist id="package-to-options">
            {destinations.map((destination) => (
              <option key={destination} value={destination} />
            ))}
          </datalist>
        </div>

        <div className="rounded-card border border-line">
          <div className="flex h-14 items-center gap-3 px-4 text-sm">
            <Icon name="calendar" className="text-lg text-ink-soft" />
            <DateField label="Departure" value={departDate} min={today ?? undefined} onChange={handleDepartChange} />
            <span aria-hidden>-</span>
            <DateField label="Return" value={returnDate} min={departDate && addDays(departDate, 1)} onChange={setSelectedReturn} />
          </div>
          <FieldError message={errors.departDate?.[0] ?? errors.returnDate?.[0]} />
        </div>

        <div className="flex h-14 items-center rounded-card border border-line px-4 text-sm xl:w-60">
          <PackagePicker value={travelers} onChange={setTravelers} />
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto sm:px-10">
          <Icon name="search" />
          Search flights + hotels
        </Button>
      </div>
    </form>
  );
};

export default PackageSearchForm;
