"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { defaultGuests } from "@/constants";
import { useToday } from "@/hooks";
import { addDays, formatCount, nightsBetween, toSearchQuery } from "@/lib";
import type { GuestCounts, HotelSearch } from "@/types";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import DateField from "./DateField";
import GuestsPicker from "./GuestsPicker";

type SearchFormProps = {
  initialValues?: HotelSearch;
  destinations?: string[];
};

const groupClass = "flex h-14 items-center gap-3 border-b border-line px-4 xl:h-full xl:border-b-0 xl:border-r";

const SearchForm = ({ initialValues, destinations = [] }: SearchFormProps) => {
  const router = useRouter();
  const today = useToday();

  const [destination, setDestination] = useState(initialValues?.destination ?? "");
  const [selectedCheckIn, setSelectedCheckIn] = useState(initialValues?.checkIn);
  const [selectedCheckOut, setSelectedCheckOut] = useState(initialValues?.checkOut);
  const [guests, setGuests] = useState<GuestCounts>({
    rooms: initialValues?.rooms ?? defaultGuests.rooms,
    adults: initialValues?.adults ?? defaultGuests.adults,
    children: initialValues?.children ?? defaultGuests.children,
  });

  const checkIn = selectedCheckIn ?? today ?? undefined;
  const checkOut = selectedCheckOut ?? (checkIn && addDays(checkIn, 1));

  const handleCheckInChange = (value: string) => {
    setSelectedCheckIn(value);

    if (checkOut && checkOut <= value) {
      setSelectedCheckOut(addDays(value, 1));
    }
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.push(`/hotels/list?${toSearchQuery({ destination, checkIn, checkOut, ...guests })}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex flex-col rounded-card border border-line text-left xl:h-16 xl:flex-row xl:items-stretch"
    >
      <div className={`${groupClass} xl:min-w-0 xl:flex-1`}>
        <Icon name="location" className="text-lg text-ink-soft" />
        <input
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="Where to?"
          aria-label="Destination"
          list="destination-options"
          className="min-w-0 flex-1 bg-transparent font-medium outline-none placeholder:text-muted"
        />
        <datalist id="destination-options">
          {destinations.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>

      <div className={groupClass}>
        <Icon name="calendar" className="text-lg text-ink-soft" />
        <DateField label="Check-in" value={checkIn} min={today ?? undefined} onChange={handleCheckInChange} />
        <span aria-hidden>-</span>
        <DateField
          label="Check-out"
          value={checkOut}
          min={checkIn && addDays(checkIn, 1)}
          onChange={setSelectedCheckOut}
        />
        {checkIn && checkOut && (
          <span className="ml-auto hidden rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium whitespace-nowrap sm:inline xl:ml-1">
            {formatCount(nightsBetween(checkIn, checkOut), "night")}
          </span>
        )}
      </div>

      <div className="flex h-14 items-center px-4 xl:h-full xl:w-72">
        <GuestsPicker value={guests} onChange={setGuests} />
      </div>

      <Button type="submit" size="lg" className="m-2 xl:h-auto xl:px-5">
        <Icon name="search" />
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
