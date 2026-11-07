import { formatCount, formatPrice, getTicketTotal } from "@/lib";
import type { AttractionBookingTrip, AttractionDetails, TicketOption } from "@/types";
import ChargeNotice from "./ChargeNotice";

type AttractionBookingSummaryProps = {
  attraction: AttractionDetails;
  ticket: TicketOption;
  trip: AttractionBookingTrip;
};

const AttractionBookingSummary = ({ attraction, ticket, trip }: AttractionBookingSummaryProps) => {
  const { currency } = attraction;
  const total = formatPrice(getTicketTotal(ticket, trip), currency);

  return (
    <aside aria-label="Booking summary" className="rounded-card bg-surface p-5 lg:sticky lg:top-24">
      <h2 className="text-xl font-bold">Price details</h2>

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <div className="flex justify-between gap-4 font-bold">
          <dt>{ticket.name}</dt>
          <dd>{total}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>
            {formatCount(trip.adults, "adult")} × {formatPrice(ticket.adultPrice, currency)}
          </dt>
          <dd>{formatPrice(Number(ticket.adultPrice) * trip.adults, currency)}</dd>
        </div>
        {trip.children > 0 && (
          <div className="flex justify-between gap-4">
            <dt>
              {formatCount(trip.children, "child", "children")} × {formatPrice(ticket.childPrice, currency)}
            </dt>
            <dd>{formatPrice(Number(ticket.childPrice) * trip.children, currency)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt>Taxes and fees</dt>
          <dd>Included</dd>
        </div>
      </dl>

      <dl className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="font-bold">Booking total</dt>
        <dd className="text-2xl font-bold text-primary">{total}</dd>
      </dl>
      <ChargeNotice />
    </aside>
  );
};

export default AttractionBookingSummary;
