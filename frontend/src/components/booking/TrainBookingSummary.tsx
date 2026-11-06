import { formatCount, formatPrice } from "@/lib";
import type { TrainOffer, TrainSearch } from "@/types";
import ChargeNotice from "./ChargeNotice";

type TrainBookingSummaryProps = {
  offer: TrainOffer;
  search: TrainSearch;
};

const TrainBookingSummary = ({ offer, search }: TrainBookingSummaryProps) => {
  const adultsTotal = Number(offer.pricePerAdult) * search.adults;

  return (
    <aside aria-label="Booking summary" className="rounded-card bg-surface p-5 shadow-card lg:sticky lg:top-24">
      <h2 className="text-xl font-bold">Price details</h2>

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-4 font-bold">
          <dt>Tickets ({formatCount(search.adults, "adult")})</dt>
          <dd>{formatPrice(adultsTotal, offer.currency)}</dd>
        </div>
        {search.children > 0 && (
          <div className="flex justify-between gap-4 font-bold">
            <dt>Tickets ({formatCount(search.children, "child", "children")})</dt>
            <dd>{formatPrice(Number(offer.totalPrice) - adultsTotal, offer.currency)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Taxes and fees</dt>
          <dd>Included</dd>
        </div>
      </dl>

      <h3 className="mt-4 text-sm font-bold">Flexibility</h3>
      <p className={`mt-2 text-sm ${offer.refundable ? "text-success" : "text-ink-soft"}`}>
        {offer.refundable ? "Refundable" : "Non-refundable"}
      </p>

      <dl className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="text-lg font-bold">Total</dt>
        <dd className="text-lg font-bold text-primary">{formatPrice(offer.totalPrice, offer.currency)}</dd>
      </dl>
      <ChargeNotice />
    </aside>
  );
};

export default TrainBookingSummary;
