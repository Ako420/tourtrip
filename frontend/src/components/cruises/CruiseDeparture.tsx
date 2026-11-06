"use client";

import { useState } from "react";
import { formatCount, formatShortDate } from "@/lib";
import type { CruiseDetails } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type CruiseDepartureProps = {
  cruise: CruiseDetails;
};

const CruiseDeparture = ({ cruise }: CruiseDepartureProps) => {
  const [sailing, setSailing] = useState(cruise.sailings[0]);
  const [isOpen, setIsOpen] = useState(false);
  const moreCount = cruise.sailings.length - 1;

  return (
    <>
      {sailing ? (
        <div className="mt-4 rounded-card bg-surface-alt p-4">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink-soft">Departure date</dt>
              <dd className="mt-1 font-bold">{formatShortDate(sailing.date)}</dd>
            </div>
            <div>
              <dt className="text-ink-soft">Departure city</dt>
              <dd className="mt-1 font-bold">{sailing.port}</dd>
            </div>
          </dl>

          {moreCount > 0 && (
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((current) => !current)}
              className="mt-3 flex items-center gap-2 text-sm text-primary"
            >
              {isOpen ? "Hide departure dates" : `View ${formatCount(moreCount, "more departure date")}`}
              <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="text-xs" />
            </button>
          )}

          {isOpen && (
            <ul className="mt-3 flex flex-col gap-2">
              {cruise.sailings.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    aria-pressed={option.id === sailing.id}
                    onClick={() => setSailing(option)}
                    className={`flex w-full flex-wrap items-center justify-between gap-x-4 rounded-md border bg-surface px-3 py-2 text-sm transition-colors duration-300 ease-out ${
                      option.id === sailing.id ? "border-primary" : "border-line hover:border-primary"
                    }`}
                  >
                    <span className="font-medium">{formatShortDate(option.date)}</span>
                    <span className="text-ink-soft">
                      {formatCount(option.nights, "night")} from {option.port}
                    </span>
                    <span className="font-bold">
                      <Price amount={option.price} currency={cruise.currency} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-4 rounded-card bg-surface-alt p-4 text-sm text-muted">There are no upcoming sailings right now.</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-end gap-4 pt-4">
        <div className="text-right">
          <p className="text-sm text-ink-soft">
            From{" "}
            <span className="text-2xl font-bold text-primary">
              <Price amount={sailing?.price ?? cruise.price} currency={cruise.currency} />
            </span>
          </p>
          <p className="text-sm text-ink-soft">per person</p>
        </div>
        <ButtonLink href={sailing ? `?date=${sailing.date}#enquire` : "#enquire"} size="lg">
          Check availability
        </ButtonLink>
      </div>
    </>
  );
};

export default CruiseDeparture;
