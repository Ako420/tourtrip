import { formatCount, formatPrice, formatShortDate } from "@/lib";
import type { TrainOffer, TrainSearch } from "@/types";
import FlightLegRow from "../flights/FlightLegRow";
import Icon from "../ui/Icon";
import ChargeNotice from "./ChargeNotice";

type TrainBookingSummaryProps = {
  offer: TrainOffer;
  search: TrainSearch;
};

const TrainBookingSummary = ({ offer, search }: TrainBookingSummaryProps) => {
  const legs = offer.inbound ? [offer.outbound, offer.inbound] : [offer.outbound];
  const adultsTotal = Number(offer.pricePerAdult) * search.adults;

  return (
    <aside aria-label="Booking summary" className="rounded-card border border-line p-4 lg:sticky lg:top-24">
      <p className="flex items-center gap-2 text-sm">
        <span className="flex size-6 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="train" className="text-[0.625rem]" />
        </span>
        <span className="font-semibold">{offer.operator}</span>
        <span className="text-muted">{offer.trainNumber}</span>
      </p>

      <ul className="mt-3 flex flex-col gap-3">
        {legs.map((leg) => (
          <li key={`${leg.from}-${leg.date}`}>
            <p className="mb-1 text-xs font-medium text-ink-soft">{formatShortDate(leg.date)}</p>
            <FlightLegRow leg={leg} showDate={false} vehicle="train" />
          </li>
        ))}
      </ul>

      <ul className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
        <li>{offer.seatClass} class</li>
        <li className={offer.refundable ? "text-success" : "text-muted"}>
          {offer.refundable ? "Refundable" : "Non-refundable"}
        </li>
      </ul>

      <dl className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">{formatCount(search.adults, "adult")}</dt>
          <dd>{formatPrice(adultsTotal, offer.currency)}</dd>
        </div>
        {search.children > 0 && (
          <div className="flex justify-between">
            <dt className="text-muted">{formatCount(search.children, "child", "children")}</dt>
            <dd>{formatPrice(Number(offer.totalPrice) - adultsTotal, offer.currency)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Taxes and fees</dt>
          <dd>Included</dd>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-line pt-2">
          <dt className="font-semibold">Total</dt>
          <dd className="text-2xl font-bold text-primary">{formatPrice(offer.totalPrice, offer.currency)}</dd>
        </div>
      </dl>
      <ChargeNotice />
    </aside>
  );
};

export default TrainBookingSummary;
