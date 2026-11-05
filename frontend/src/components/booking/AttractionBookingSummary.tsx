import { formatCount, formatPrice, formatShortDate, getTicketTotal } from "@/lib";
import type { AttractionBookingTrip, AttractionDetails, TicketOption } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import ChargeNotice from "./ChargeNotice";

type AttractionBookingSummaryProps = {
  attraction: AttractionDetails;
  ticket: TicketOption;
  trip: AttractionBookingTrip;
};

const AttractionBookingSummary = ({ attraction, ticket, trip }: AttractionBookingSummaryProps) => {
  const { currency } = attraction;

  return (
    <aside aria-label="Booking summary" className="overflow-hidden rounded-card border border-line lg:sticky lg:top-24">
      <div className="relative aspect-[16/9] bg-surface-alt">
        <AppImage src={attraction.imageUrl} alt={attraction.name} fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
      </div>

      <div className="p-4">
        <h2 className="font-semibold">{attraction.name}</h2>
        <p className="text-sm text-muted">
          {attraction.city}, {attraction.country}
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-muted">Date</dt>
            <dd className="font-medium">{formatShortDate(trip.date)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Duration</dt>
            <dd className="font-medium">{attraction.duration}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted">Ticket</dt>
            <dd className="font-medium">{ticket.name}</dd>
          </div>
        </dl>

        <ul className="mt-3 flex flex-col gap-1 text-sm text-success">
          {ticket.includes.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <Icon name="check" />
              {item}
            </li>
          ))}
          {attraction.freeCancellation && (
            <li className="flex items-center gap-2">
              <Icon name="check" />
              Free cancellation
            </li>
          )}
        </ul>

        <dl className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">
              {formatCount(trip.adults, "adult")} x {formatPrice(ticket.adultPrice, currency)}
            </dt>
            <dd>{formatPrice(Number(ticket.adultPrice) * trip.adults, currency)}</dd>
          </div>
          {trip.children > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">
                {formatCount(trip.children, "child", "children")} x {formatPrice(ticket.childPrice, currency)}
              </dt>
              <dd>{formatPrice(Number(ticket.childPrice) * trip.children, currency)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted">Taxes and fees</dt>
            <dd>Included</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="type-price font-bold text-primary">{formatPrice(getTicketTotal(ticket, trip), currency)}</dd>
          </div>
        </dl>
        <ChargeNotice />
      </div>
    </aside>
  );
};

export default AttractionBookingSummary;
