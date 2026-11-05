"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { tripTypes } from "@/constants";
import { useToday } from "@/hooks";
import { addDays, toFlightQuery } from "@/lib";
import { flightSearchSchema } from "@/schemas";
import type { FlightSearch, TripType } from "@/types";
import DateField from "../search/DateField";
import PassengerPicker from "../search/PassengerPicker";
import ButtonLink from "../ui/ButtonLink";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type FlightSearchFormProps = {
  initialValues: FlightSearch;
  airports: string[];
  compact?: boolean;
};

type FieldErrors = Record<string, string[] | undefined>;

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return <p className="px-4 pb-2 text-left text-sm text-danger">{message}</p>;
};

const FlightSearchForm = ({ initialValues, airports, compact = false }: FlightSearchFormProps) => {
  const router = useRouter();
  const today = useToday();

  const [tripType, setTripType] = useState<TripType>(initialValues.tripType);
  const [isNonstop, setIsNonstop] = useState(initialValues.isNonstop);
  const [from, setFrom] = useState(initialValues.from ?? "");
  const [to, setTo] = useState(initialValues.to ?? "");
  const [selectedDepart, setSelectedDepart] = useState(initialValues.departDate);
  const [selectedReturn, setSelectedReturn] = useState(initialValues.returnDate);
  const [passengers, setPassengers] = useState({
    adults: initialValues.adults,
    children: initialValues.children,
    cabin: initialValues.cabin,
  });
  const [swapTurns, setSwapTurns] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});

  const departDate = selectedDepart ?? (today ? addDays(today, 2) : undefined);
  const returnDate = selectedReturn ?? (departDate && addDays(departDate, 2));
  const isOneWay = tripType === "one-way";

  const handleDepartChange = (value: string) => {
    setSelectedDepart(value);

    if (returnDate && returnDate <= value) {
      setSelectedReturn(addDays(value, 1));
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSwapTurns((turns) => turns + 1);
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = { from, to, tripType, departDate: departDate ?? "", returnDate: isOneWay ? undefined : returnDate };
    const result = flightSearchSchema.safeParse(values);

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    router.push(`/flights/results?${toFlightQuery({ ...result.data, isNonstop, ...passengers })}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      noValidate
      className={compact ? "text-ink" : "rounded-panel bg-surface p-4 text-ink shadow-card sm:p-5"}
    >
      <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {tripTypes.map((type) => (
          <label key={type.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="tripType"
              checked={tripType === type.value}
              onChange={() => setTripType(type.value)}
              className="accent-primary"
            />
            {type.label}
          </label>
        ))}
        <label className="flex cursor-pointer items-center gap-2 md:ml-4">
          <input
            type="checkbox"
            checked={isNonstop}
            onChange={(event) => setIsNonstop(event.target.checked)}
            className="accent-primary"
          />
          Nonstop
        </label>
      </div>

      <div className={`grid gap-3 ${compact ? "xl:grid-cols-[1fr_auto_auto_auto]" : "xl:grid-cols-[1fr_auto_auto]"}`}>
        <div className="relative rounded-card border border-line sm:grid sm:grid-cols-2">
          <div className="border-b border-line sm:border-r sm:border-b-0">
            <label className="flex h-14 items-center gap-3 px-4">
              <Icon name="plane" className="-rotate-45 text-ink-soft" />
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="Leaving from"
                aria-label="Leaving from"
                aria-invalid={Boolean(errors.from)}
                list="airport-options"
                className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
              />
            </label>
            <FieldError message={errors.from?.[0]} />
          </div>
          <div>
            <label className="flex h-14 items-center gap-3 px-4 sm:pl-7">
              <Icon name="location" className="text-ink-soft" />
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="Going to"
                aria-label="Going to"
                aria-invalid={Boolean(errors.to)}
                list="airport-options"
                className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
              />
            </label>
            <FieldError message={errors.to?.[0]} />
          </div>
          <button
            type="button"
            aria-label="Swap departure and destination"
            onClick={handleSwap}
            style={{ transform: `rotate(${swapTurns * 180}deg)` }}
            className="absolute top-14 right-4 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-primary transition-transform duration-300 ease-out hover:bg-primary-soft sm:top-7 sm:right-auto sm:left-1/2 sm:-ml-4"
          >
            <Icon name="swap" className="text-sm" />
          </button>
          <datalist id="airport-options">
            {airports.map((airport) => (
              <option key={airport} value={airport} />
            ))}
          </datalist>
        </div>

        <div className="rounded-card border border-line">
          <div className="flex h-14 items-center gap-3 px-4 text-sm">
            <Icon name="calendar" className="text-lg text-ink-soft" />
            <DateField label="Departure" value={departDate} min={today ?? undefined} onChange={handleDepartChange} />
            {!isOneWay && (
              <>
                <span aria-hidden>-</span>
                <DateField
                  label="Return"
                  value={returnDate}
                  min={departDate && addDays(departDate, 1)}
                  onChange={setSelectedReturn}
                />
              </>
            )}
          </div>
          <FieldError message={errors.departDate?.[0] ?? errors.returnDate?.[0]} />
        </div>

        <div className="flex h-14 items-center rounded-card border border-line px-4 text-sm xl:w-60">
          <PassengerPicker value={passengers} onChange={setPassengers} />
        </div>

        {compact && (
          <Button type="submit" size="lg" aria-label="Search" className="h-14 px-5">
            <Icon name="search" />
          </Button>
        )}
      </div>

      {!compact && (
        <div className="mt-3 flex flex-col justify-end gap-2 sm:flex-row">
          <ButtonLink href="/packages" variant="outline" size="lg">
            Flight + Hotel
          </ButtonLink>
          <Button type="submit" size="lg" className="sm:px-10">
            <Icon name="search" />
            Search
          </Button>
        </div>
      )}
    </form>
  );
};

export default FlightSearchForm;
