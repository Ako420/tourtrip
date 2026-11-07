"use client";

import { useState } from "react";
import { formatCount, formatShortDate } from "@/lib";
import type { TrainOffer } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type TrainOfferCardProps = {
  offer: TrainOffer;
  bookHref: string;
  travelers: number;
};

const TrainOfferCard = ({ offer, bookHref, travelers }: TrainOfferCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const legs = offer.inbound ? [offer.outbound, offer.inbound] : [offer.outbound];

  return (
    <article className="bg-surface px-4 py-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="flex items-center gap-3 text-sm sm:w-36 sm:shrink-0">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name="train" />
          </span>
          <span>
            {offer.operator}
            <span className="block text-xs text-muted">{offer.trainNumber}</span>
          </span>
        </p>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {legs.map((leg) => (
            <FlightLegRow key={`${leg.from}-${leg.date}`} leg={leg} vehicle="train" large />
          ))}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:w-56 sm:justify-end">
          <div className="sm:text-right">
            <p className="text-xl font-bold text-primary"><Price amount={offer.totalPrice} currency={offer.currency} /></p>
            <p className="text-sm text-ink-soft">
              {travelers > 1 ? `Total, ${formatCount(travelers, "traveler")}` : "Per traveler"}
            </p>
            {offer.seatsLeft && <p className="text-xs text-promo">{formatCount(offer.seatsLeft, "seat")} left</p>}
          </div>
          <ButtonLink href={bookHref} className="px-6">
            Select
          </ButtonLink>
        </div>
      </div>

      <div className="mt-2">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
          className="flex items-center gap-2 text-sm text-primary"
        >
          Journey details
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
              <dt className="text-muted">Class</dt>
              <dd>{offer.seatClass}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Ticket</dt>
              <dd>{offer.refundable ? "Refundable" : "Non-refundable"}</dd>
            </div>
          </dl>
        )}
      </div>
    </article>
  );
};

export default TrainOfferCard;
