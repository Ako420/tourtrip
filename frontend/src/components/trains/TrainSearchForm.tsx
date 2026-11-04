"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { passengerLimits, seatClasses, tripTypes } from "@/constants";
import { useToday } from "@/hooks";
import { addDays, formatCount, toTrainQuery } from "@/lib";
import { flightSearchSchema } from "@/schemas";
import type { SeatClass, TrainSearch, TripType } from "@/types";
import CounterRow from "../search/CounterRow";
import DateField from "../search/DateField";
import PickerPopover from "../search/PickerPopover";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type TrainSearchFormProps = {
  initialValues: TrainSearch;
  stations: string[];
};

type FieldErrors = Record<string, string[] | undefined>;

const inputClass = "w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return <p className="px-4 pb-2 text-left text-sm text-danger">{message}</p>;
};

const TrainSearchForm = ({ initialValues, stations }: TrainSearchFormProps) => {
  const router = useRouter();
  const today = useToday();

  const [tripType, setTripType] = useState<TripType>(initialValues.tripType);
  const [from, setFrom] = useState(initialValues.from ?? "");
  const [to, setTo] = useState(initialValues.to ?? "");
  const [selectedDepart, setSelectedDepart] = useState(initialValues.departDate);
  const [selectedReturn, setSelectedReturn] = useState(initialValues.returnDate);
  const [adults, setAdults] = useState(initialValues.adults);
  const [children, setChildren] = useState(initialValues.children);
  const [seatClass, setSeatClass] = useState<SeatClass>(initialValues.seatClass);
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

    const result = flightSearchSchema.safeParse({
      from,
      to,
      tripType,
      departDate: departDate ?? "",
      returnDate: isOneWay ? undefined : returnDate,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});
    router.push(`/trains/results?${toTrainQuery({ ...result.data, adults, children, seatClass })}`);
  };

  return (
    <form onSubmit={handleSubmit} role="search" noValidate className="rounded-panel bg-surface p-4 text-ink shadow-card sm:p-5">
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
      </div>

      <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
        <div className="relative rounded-card border border-line sm:grid sm:grid-cols-2">
          <div className="border-b border-line sm:border-r sm:border-b-0">
            <label className="flex h-14 items-center gap-3 px-4">
              <Icon name="train" className="text-ink-soft" />
              <input
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                placeholder="From"
                aria-label="From"
                aria-invalid={Boolean(errors.from)}
                list="train-stations"
                className={inputClass}
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
                placeholder="To"
                aria-label="To"
                aria-invalid={Boolean(errors.to)}
                list="train-stations"
                className={inputClass}
              />
            </label>
            <FieldError message={errors.to?.[0]} />
          </div>
          <button
            type="button"
            aria-label="Swap from and to"
            onClick={handleSwap}
            style={{ transform: `rotate(${swapTurns * 180}deg)` }}
            className="absolute top-14 right-4 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-primary transition-transform duration-300 ease-out hover:bg-primary-soft sm:top-7 sm:right-auto sm:left-1/2 sm:-ml-4"
          >
            <Icon name="swap" className="text-sm" />
          </button>
          <datalist id="train-stations">
            {stations.map((station) => (
              <option key={station} value={station} />
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
          <PickerPopover iconName="user" summary={`${formatCount(adults + children, "traveler")} · ${seatClass}`}>
            <CounterRow label="Adults" value={adults} {...passengerLimits.adults} onChange={setAdults} />
            <CounterRow label="Children" value={children} {...passengerLimits.children} onChange={setChildren} />
            <label className="mt-2 block font-medium">
              Class
              <select
                value={seatClass}
                onChange={(event) => setSeatClass(event.target.value as SeatClass)}
                className="mt-1 h-10 w-full rounded-md border border-line bg-surface px-2 font-normal"
              >
                {seatClasses.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </PickerPopover>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto sm:px-10">
          <Icon name="search" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default TrainSearchForm;
