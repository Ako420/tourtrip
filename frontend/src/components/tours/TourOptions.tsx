"use client";

import { useState } from "react";
import { enquiryLimits } from "@/constants";
import { useToday } from "@/hooks";
import { formatCount } from "@/lib";
import type { TourDeparture, TourDetails } from "@/types";
import CounterRow from "../search/CounterRow";
import DateField from "../search/DateField";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";
import TourCalendar from "./TourCalendar";

type TourOptionsProps = {
  tour: TourDetails;
};

const TourOptions = ({ tour }: TourOptionsProps) => {
  const today = useToday();
  const [departure, setDeparture] = useState<TourDeparture>();
  const [startDate, setStartDate] = useState<string>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const isPrivate = tour.type === "private";
  const date = isPrivate ? startDate : departure?.date;
  const travelers = adults + children;
  const query = new URLSearchParams({ travelers: String(travelers), ...(date ? { date } : {}) });

  return (
    <aside className="rounded-card bg-surface p-5 lg:sticky lg:top-24">
      <h2 className="mb-3 text-2xl font-bold">Trip options</h2>

      {isPrivate ? (
        <>
          <p className="mb-3 text-sm text-ink-soft">This tour runs just for your group, so you choose the start date.</p>
          <div className="flex h-10 items-center gap-3 rounded-md border border-line px-3 text-sm">
            <Icon name="calendar" className="text-ink-soft" />
            <DateField label="Choose a start date" value={startDate} min={today ?? undefined} onChange={setStartDate} />
          </div>
        </>
      ) : tour.departures.length > 0 ? (
        <TourCalendar departures={tour.departures} currency={tour.currency} selectedId={departure?.id} onSelect={setDeparture} />
      ) : (
        <p className="text-sm text-muted">There are no upcoming departures right now.</p>
      )}

      {departure && <p className="mt-2 text-sm text-ink-soft">{formatCount(departure.seatsLeft, "seat")} left</p>}

      <div className="mt-3">
        <CounterRow
          label="Adults"
          value={adults}
          min={enquiryLimits.minTravelers}
          max={enquiryLimits.maxTravelers - children}
          onChange={setAdults}
        />
        <CounterRow label="Children" value={children} min={0} max={enquiryLimits.maxTravelers - adults} onChange={setChildren} />
      </div>

      <p className="mt-2 text-sm text-ink-soft">
        {departure ? "" : "From "}
        <span className="type-price font-bold text-primary">
          <Price amount={departure?.price ?? tour.price} currency={tour.currency} />
        </span>{" "}
        per person
      </p>

      <ButtonLink href={`?${query}#enquire`} size="lg" className="mt-3 w-full">
        Check availability
      </ButtonLink>
      <ButtonLink href="/assistant" variant="outline" size="lg" className="mt-2 w-full">
        Ask about this trip
      </ButtonLink>
    </aside>
  );
};

export default TourOptions;
