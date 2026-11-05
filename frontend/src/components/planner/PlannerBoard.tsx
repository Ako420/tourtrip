"use client";

import { useState } from "react";
import {
  addActivity,
  addSuggestion,
  fillEmptySlots,
  formatCount,
  formatPrice,
  formatShortDate,
  getDayTotal,
  getPlannedIds,
  getPlanTotal,
  matchesDestination,
  moveItem,
  removeItem,
} from "@/lib";
import type { PlannerSuggestion, TripPlan } from "@/types";
import Button from "../ui/Button";
import ButtonLink from "../ui/ButtonLink";
import CustomActivityForm from "./CustomActivityForm";
import PlanItemRow from "./PlanItemRow";
import SuggestionList from "./SuggestionList";

type PlannerBoardProps = {
  plan: TripPlan;
  suggestions: PlannerSuggestion[];
  onChange: (plan: TripPlan) => void;
  onReset: () => void;
};

const PlannerBoard = ({ plan, suggestions, onChange, onReset }: PlannerBoardProps) => {
  const [dayIndex, setDayIndex] = useState(0);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const day = plan.days[dayIndex] ?? plan.days[0];
  const dayLabel = `Day ${dayIndex + 1}`;
  const destinationQuery = encodeURIComponent(plan.destination);
  const matches = suggestions.filter((suggestion) => matchesDestination(suggestion, plan.destination));
  const shown = matches.length > 0 ? matches : suggestions;
  const plannedIds = getPlannedIds(plan);
  const canFill = matches.some((suggestion) => !plannedIds.has(suggestion.id));

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="type-page font-bold">Your trip to {plan.destination}</h1>
          <p className="mt-1 text-sm text-muted">
            {formatShortDate(plan.startDate)} - {formatShortDate(plan.endDate)} · {formatCount(plan.days.length, "day")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Estimated activities</p>
          <p className="type-price font-bold text-primary">{formatPrice(getPlanTotal(plan), plan.currency)}</p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={!canFill} onClick={() => onChange(fillEmptySlots(plan, matches))} className="disabled:opacity-60">
          Fill my days
        </Button>
        <ButtonLink href={`/hotels?destination=${destinationQuery}`} size="sm" variant="outline">
          Find hotels
        </ButtonLink>
        <ButtonLink href={`/flights?to=${destinationQuery}#deals`} size="sm" variant="outline">
          Find flights
        </ButtonLink>
        {isConfirmingReset ? (
          <span className="flex items-center gap-2 text-sm sm:ml-auto">
            Delete this plan?
            <Button type="button" size="sm" onClick={onReset}>
              Yes, delete
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setIsConfirmingReset(false)}>
              Keep it
            </Button>
          </span>
        ) : (
          <Button type="button" size="sm" variant="ghost" onClick={() => setIsConfirmingReset(true)} className="sm:ml-auto">
            Start over
          </Button>
        )}
      </div>

      <div role="tablist" aria-label="Trip days" className="scrollbar-none mt-5 flex gap-2 overflow-x-auto pb-1">
        {plan.days.map((planDay, index) => (
          <button
            key={planDay.date}
            type="button"
            role="tab"
            aria-selected={index === dayIndex}
            onClick={() => setDayIndex(index)}
            className={`shrink-0 rounded-card border px-3 py-2 text-left transition-colors duration-300 ease-out ${
              index === dayIndex ? "border-primary bg-primary-soft" : "border-line hover:border-primary"
            }`}
          >
            <span className="block text-sm font-semibold">Day {index + 1}</span>
            <span className="block text-xs text-muted">{formatShortDate(planDay.date)}</span>
            <span className="block text-xs text-muted">{formatCount(planDay.items.length, "activity", "activities")}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label={dayLabel}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold">
              {dayLabel}, {formatShortDate(day.date)}
            </h2>
            <p className="text-sm text-muted">{formatPrice(getDayTotal(day.items), plan.currency)}</p>
          </div>

          {day.items.length > 0 ? (
            <ol className="flex flex-col gap-2">
              {day.items.map((item, index) => (
                <PlanItemRow
                  key={item.id}
                  item={item}
                  currency={plan.currency}
                  isFirst={index === 0}
                  isLast={index === day.items.length - 1}
                  onMove={(direction) => onChange(moveItem(plan, dayIndex, item.id, direction))}
                  onRemove={() => onChange(removeItem(plan, dayIndex, item.id))}
                />
              ))}
            </ol>
          ) : (
            <p className="rounded-card bg-surface-alt p-6 text-center text-sm text-muted">
              {canFill
                ? "Nothing planned yet. Add a suggestion or your own activity."
                : `No more suggestions for ${plan.destination}. Add your own activity.`}
            </p>
          )}

          <CustomActivityForm onAdd={(activity) => onChange(addActivity(plan, dayIndex, activity))} />
        </section>

        <SuggestionList
          title={matches.length > 0 ? `Things to do in ${plan.destination}` : "Popular things to do"}
          suggestions={shown}
          plannedIds={plannedIds}
          dayLabel={dayLabel}
          onAdd={(suggestion) => onChange(addSuggestion(plan, dayIndex, suggestion))}
        />
      </div>
    </>
  );
};

export default PlannerBoard;
