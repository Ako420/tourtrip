"use client";

import { useState } from "react";
import type { TourDay } from "@/types";
import Icon from "../ui/Icon";

type TourItineraryProps = {
  days: TourDay[];
};

const TourItinerary = ({ days }: TourItineraryProps) => {
  const [openDays, setOpenDays] = useState<number[]>([]);
  const isAllOpen = openDays.length === days.length;

  const toggle = (index: number) => {
    setOpenDays((current) => (current.includes(index) ? current.filter((day) => day !== index) : [...current, index]));
  };

  return (
    <section id="itinerary" className="mt-8 scroll-mt-32">
      <h2 className="type-section font-bold">{days.length}-day itinerary</h2>
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={() => setOpenDays(isAllOpen ? [] : days.map((_, index) => index))}
          className="text-sm hover:text-primary"
        >
          {isAllOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <ol className="divide-y divide-line">
        {days.map((day, index) => {
          const isOpen = openDays.includes(index);

          return (
            <li key={day.title}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(index)}
                className="flex w-full items-start gap-4 py-4 text-left"
              >
                <span className="shrink-0 font-semibold">Day {index + 1}</span>
                <span className="min-w-0 flex-1 font-medium">{day.title}</span>
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="mt-1 text-sm" />
              </button>
              {isOpen && <p className="pb-4 text-sm text-ink-soft sm:pl-14">{day.description}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default TourItinerary;
