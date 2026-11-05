"use client";

import { useState } from "react";
import { formatCount, formatShortDate } from "@/lib";
import type { FlightOffer } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import FlightLegRow from "./FlightLegRow";
import Price from "../ui/Price";

type FlightOfferCardProps = {
  offer: FlightOffer;
  bookHref: string;
  travelers: number;
};

const FlightOfferCard = ({ offer, bookHref, travelers }: FlightOfferCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const legs = offer.inbound ? [offer.outbound, offer.inbound] : [offer.outbound];

  return (
    <article className="rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card">
      <div className="flex flex-col sm:flex-row">
        <div className="flex-1 p-4">
          <p className="mb-3 flex items-center gap-2 text-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Icon name="plane" className="text-tiny" />
            </span>
            <span className="font-medium">{offer.airline}</span>
            <span className="text-muted">{offer.flightNumber}</span>
          </p>
          <div className="flex flex-col gap-3">
            {legs.map((leg) => (
              <FlightLegRow key={`${leg.from}-${leg.date}`} leg={leg} />
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line p-4 sm:w-44 sm:flex-col sm:items-stretch sm:justify-center sm:border-t-0 sm:border-l sm:text-right">
          <div>
            <p className="type-price font-bold text-primary"><Price amount={offer.totalPrice} currency={offer.currency} /></p>
            <p className="text-xs text-muted">
              {travelers > 1 ? `total, ${formatCount(travelers, "traveler")}` : "per traveler"}
            </p>
            {offer.seatsLeft && <p className="text-xs text-promo">{formatCount(offer.seatsLeft, "seat")} left</p>}
          </div>
          <ButtonLink href={bookHref} size="sm">
            Select
          </ButtonLink>
        </div>
      </div>

      <div className="border-t border-line px-4 py-2">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="flex items-center gap-2 text-sm font-medium text-primary"
        >
          Flight details
          <Icon name="chevron-down" className={`text-xs transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <dl className="mt-2 grid gap-x-6 gap-y-1 pb-2 text-sm sm:grid-cols-2">
            {legs.map((leg, index) => (
              <div key={leg.date} className="flex justify-between gap-3">
                <dt className="text-muted">{index === 0 ? "Departure" : "Return"}</dt>
                <dd>{formatShortDate(leg.date)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Cabin</dt>
              <dd>{offer.cabin}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Aircraft</dt>
              <dd>{offer.aircraft}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Checked bag</dt>
              <dd>{offer.checkedBag ? "Included" : "Not included"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Changes</dt>
              <dd>{offer.refundable ? "Refundable" : "Non-refundable"}</dd>
            </div>
          </dl>
        )}
      </div>
    </article>
  );
};

export default FlightOfferCard;
