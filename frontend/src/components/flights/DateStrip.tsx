"use client";

import { useEffect, useRef } from "react";
import { useToday } from "@/hooks";
import { formatPrice, formatShortDate } from "@/lib";
import type { FareDay } from "@/types";

type DateStripProps = {
  days: FareDay[];
  selectedDate?: string;
  currency: string;
  onSelect: (date: string) => void;
};

const DateStrip = ({ days, selectedDate, currency, onSelect }: DateStripProps) => {
  const today = useToday();
  const listRef = useRef<HTMLUListElement>(null);
  const visibleDays = days.filter((day) => !today || day.date >= today);
  const lowest = Math.min(...visibleDays.map((day) => Number(day.lowestPrice)));

  useEffect(() => {
    const list = listRef.current;
    const selected = list?.querySelector<HTMLElement>("[aria-pressed='true']");

    // Keeps the chosen date visible on phones, where the strip scrolls sideways.
    if (list && selected) {
      list.scrollLeft = selected.offsetLeft - list.offsetLeft - (list.clientWidth - selected.offsetWidth) / 2;
    }
  }, [selectedDate, today]);

  return (
    <div>
      <p className="mb-2 text-xs text-muted">Lowest fare per adult by departure date</p>
      <ul ref={listRef} aria-label="Fares by departure date" className="scrollbar-none flex gap-2 overflow-x-auto">
      {visibleDays.map((day) => {
        const isSelected = day.date === selectedDate;

        return (
          <li key={day.date} className="min-w-28 flex-1">
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(day.date)}
              className={`w-full rounded-card border px-2 py-2 text-center transition-colors duration-300 ease-out ${
                isSelected ? "border-primary bg-primary-soft" : "border-line hover:border-primary"
              }`}
            >
              <span className="block text-xs text-muted">{formatShortDate(day.date)}</span>
              <span className={`block text-sm font-semibold ${Number(day.lowestPrice) === lowest ? "text-success" : ""}`}>
                {formatPrice(day.lowestPrice, currency)}
              </span>
            </button>
          </li>
        );
      })}
      </ul>
    </div>
  );
};

export default DateStrip;
