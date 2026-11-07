"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { z } from "zod";
import { rentalTimes } from "@/constants";
import { useToday } from "@/hooks";
import { addDays, toCarQuery } from "@/lib";
import { carSearchSchema } from "@/schemas";
import type { CarCategory, CarSearch } from "@/types";
import DateField from "../search/DateField";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type CarSearchFormProps = {
  initialValues: CarSearch;
  locations: string[];
  preselectedType?: CarCategory;
  compact?: boolean;
  highlighted?: boolean;
};

type FieldErrors = Record<string, string[] | undefined>;

const boxClass = "flex h-14 items-center gap-3 rounded-card border border-line px-4";

const selectClass = "bg-transparent text-sm font-semibold outline-none";

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return <p className="mt-1 text-left text-sm text-danger">{message}</p>;
};

const CarSearchForm = ({
  initialValues,
  locations,
  preselectedType,
  compact = false,
  highlighted = false,
}: CarSearchFormProps) => {
  const router = useRouter();
  const today = useToday();

  const [location, setLocation] = useState(initialValues.location ?? "");
  const [hasDifferentDropoff, setHasDifferentDropoff] = useState(Boolean(initialValues.dropoffLocation));
  const [dropoffLocation, setDropoffLocation] = useState(initialValues.dropoffLocation ?? "");
  const [selectedPickup, setSelectedPickup] = useState(initialValues.pickupDate);
  const [selectedDropoff, setSelectedDropoff] = useState(initialValues.dropoffDate);
  const [pickupTime, setPickupTime] = useState(initialValues.pickupTime);
  const [dropoffTime, setDropoffTime] = useState(initialValues.dropoffTime);
  const [isStandardAge, setIsStandardAge] = useState(initialValues.isStandardAge);
  const [errors, setErrors] = useState<FieldErrors>({});

  const pickupDate = selectedPickup ?? (today ? addDays(today, 1) : undefined);
  const dropoffDate = selectedDropoff ?? (pickupDate && addDays(pickupDate, 3));

  const handlePickupChange = (value: string) => {
    setSelectedPickup(value);

    if (dropoffDate && dropoffDate < value) {
      setSelectedDropoff(addDays(value, 1));
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = carSearchSchema.safeParse({
      location,
      hasDifferentDropoff,
      dropoffLocation,
      pickupDate: pickupDate ?? "",
      pickupTime,
      dropoffDate: dropoffDate ?? "",
      dropoffTime,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    setErrors({});

    const search = {
      ...result.data,
      dropoffLocation: hasDifferentDropoff ? result.data.dropoffLocation : undefined,
      isStandardAge,
    };

    router.push(`/cars/results?${toCarQuery(search, { categories: preselectedType ? [preselectedType] : [] })}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      noValidate
      className={compact ? "text-ink" : "rounded-panel bg-surface p-4 text-ink shadow-card sm:p-5"}
    >
      <div
        className={`grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto] ${
          highlighted ? "rounded-card border-3 border-primary p-1" : ""
        }`}
      >
        <div className={`grid gap-3 sm:col-span-2 xl:col-span-1 ${hasDifferentDropoff ? "sm:grid-cols-2" : ""}`}>
          <div>
            <label className={boxClass}>
              <Icon name="car" className="text-ink-soft" />
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Pick-up location"
                aria-label="Pick-up location"
                aria-invalid={Boolean(errors.location)}
                list="car-locations"
                className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
              />
            </label>
            <FieldError message={errors.location?.[0]} />
          </div>

          {hasDifferentDropoff && (
            <div>
              <label className={boxClass}>
                <Icon name="location" className="text-ink-soft" />
                <input
                  value={dropoffLocation}
                  onChange={(event) => setDropoffLocation(event.target.value)}
                  placeholder="Drop-off location"
                  aria-label="Drop-off location"
                  aria-invalid={Boolean(errors.dropoffLocation)}
                  list="car-locations"
                  className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
                />
              </label>
              <FieldError message={errors.dropoffLocation?.[0]} />
            </div>
          )}
          {(!compact || highlighted) && (
            <datalist id="car-locations">
              {locations.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          )}
        </div>

        <div className={boxClass}>
          <Icon name="calendar" className="text-ink-soft" />
          <div className="text-sm">
            <p className="text-xs text-muted">Pick-up</p>
            <DateField label="Pick-up date" value={pickupDate} min={today ?? undefined} onChange={handlePickupChange} />
          </div>
          <select
            aria-label="Pick-up time"
            value={pickupTime}
            onChange={(event) => setPickupTime(event.target.value)}
            className={`${selectClass} ml-auto`}
          >
            {rentalTimes.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </select>
        </div>

        <div>
          <div className={boxClass}>
            <Icon name="calendar" className="text-ink-soft" />
            <div className="text-sm">
              <p className="text-xs text-muted">Drop-off</p>
              <DateField
                label="Drop-off date"
                value={dropoffDate}
                min={pickupDate}
                onChange={setSelectedDropoff}
              />
            </div>
            <select
              aria-label="Drop-off time"
              value={dropoffTime}
              onChange={(event) => setDropoffTime(event.target.value)}
              className={`${selectClass} ml-auto`}
            >
              {rentalTimes.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </div>
          <FieldError message={errors.dropoffDate?.[0]} />
        </div>

        <Button type="submit" size="lg" className="sm:col-span-2 sm:ml-auto sm:px-10 xl:col-span-1 xl:ml-0 xl:px-8">
          <Icon name="search" />
          Search
        </Button>
      </div>

      <div className="mt-3 text-sm">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hasDifferentDropoff}
              onChange={(event) => setHasDifferentDropoff(event.target.checked)}
              className="size-4 accent-primary"
            />
            Drop off at a different location
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isStandardAge}
              onChange={(event) => setIsStandardAge(event.target.checked)}
              className="size-4 accent-primary"
            />
            Driver aged 25 to 69
          </label>
        </div>
      </div>
    </form>
  );
};

export default CarSearchForm;
