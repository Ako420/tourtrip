"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToday } from "@/hooks";
import { addDays, toSearchQuery } from "@/lib";
import type { HotelSearch } from "@/types";
import DateField from "../search/DateField";
import GuestsPicker from "../search/GuestsPicker";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type StayBarProps = {
  slug: string;
  search: HotelSearch;
};

const StayBar = ({ slug, search }: StayBarProps) => {
  const router = useRouter();
  const today = useToday();

  const [checkIn, setCheckIn] = useState(search.checkIn);
  const [checkOut, setCheckOut] = useState(search.checkOut);
  const [guests, setGuests] = useState({ rooms: search.rooms, adults: search.adults, children: search.children });

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);

    if (!checkOut || checkOut <= value) {
      setCheckOut(addDays(value, 1));
    }
  };

  const handleUpdate = () => {
    router.push(`/hotels/${slug}?${toSearchQuery({ ...search, checkIn, checkOut, ...guests })}`, { scroll: false });
  };

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-card border border-line p-3 md:flex-row md:items-center">
      <div className="flex h-10 items-center gap-3 px-1 text-sm">
        <Icon name="calendar" className="text-ink-soft" />
        <DateField label="Check-in" value={checkIn} min={today ?? undefined} onChange={handleCheckInChange} />
        <span aria-hidden>-</span>
        <DateField
          label="Check-out"
          value={checkOut}
          min={checkIn ? addDays(checkIn, 1) : undefined}
          onChange={setCheckOut}
        />
      </div>
      <div className="flex h-10 flex-1 items-center px-1 text-sm">
        <GuestsPicker value={guests} onChange={setGuests} />
      </div>
      <Button type="button" onClick={handleUpdate} size="sm">
        Update
      </Button>
    </div>
  );
};

export default StayBar;
