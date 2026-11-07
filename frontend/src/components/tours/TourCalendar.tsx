"use client";

import { useState } from "react";
import type { TourDeparture } from "@/types";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type TourCalendarProps = {
  departures: TourDeparture[];
  currency: string;
  selectedId?: string;
  onSelect: (departure: TourDeparture) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toMonthIndex = (date: string) => Number(date.slice(0, 4)) * 12 + Number(date.slice(5, 7)) - 1;

const stepClass = "flex size-8 items-center justify-center rounded-full hover:text-primary disabled:text-muted";

const TourCalendar = ({ departures, currency, selectedId, onSelect }: TourCalendarProps) => {
  const monthIndexes = departures.map(({ date }) => toMonthIndex(date));
  const firstMonth = Math.min(...monthIndexes);
  const lastMonth = Math.max(...monthIndexes);
  const [month, setMonth] = useState(firstMonth);

  const year = Math.floor(month / 12);
  const monthOfYear = month % 12;
  const firstDay = new Date(Date.UTC(year, monthOfYear, 1));
  const dayCount = new Date(Date.UTC(year, monthOfYear + 1, 0)).getUTCDate();
  const prefix = `${year}-${String(monthOfYear + 1).padStart(2, "0")}-`;
  const title = firstDay.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div>
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Previous month" disabled={month <= firstMonth} onClick={() => setMonth(month - 1)} className={stepClass}>
          <Icon name="chevron-left" />
        </button>
        <p className="font-medium" aria-live="polite">
          {title}
        </p>
        <button type="button" aria-label="Next month" disabled={month >= lastMonth} onClick={() => setMonth(month + 1)} className={stepClass}>
          <Icon name="chevron-right" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="text-xs font-medium">
            {day}
          </span>
        ))}

        {Array.from({ length: firstDay.getUTCDay() }, (_, index) => (
          <span key={index} />
        ))}

        {Array.from({ length: dayCount }, (_, index) => {
          const day = index + 1;
          const departure = departures.find(({ date }) => date.startsWith(`${prefix}${String(day).padStart(2, "0")}`));

          return departure ? (
            <button
              key={day}
              type="button"
              aria-pressed={departure.id === selectedId}
              onClick={() => onSelect(departure)}
              className={`flex h-12 flex-col items-center justify-center rounded-md text-sm font-medium transition-colors duration-300 ease-out ${
                departure.id === selectedId ? "bg-primary text-white" : "text-primary hover:bg-primary-soft"
              }`}
            >
              {day}
              <span className="text-tiny font-normal">
                <Price amount={departure.price} currency={currency} />
              </span>
            </button>
          ) : (
            <span key={day} className="flex h-12 items-center justify-center text-sm text-muted">
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TourCalendar;
