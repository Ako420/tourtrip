import { formatCount, formatPrice, formatShortDate, getRentalDays } from "@/lib";
import type { CarOffer, CarSearch } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type CarBookingSummaryProps = {
  offer: CarOffer;
  search: CarSearch;
};

const CarBookingSummary = ({ offer, search }: CarBookingSummaryProps) => {
  const days = getRentalDays(search);

  return (
    <aside aria-label="Booking summary" className="overflow-hidden rounded-card border border-line lg:sticky lg:top-24">
      <div className="relative aspect-[16/9] bg-surface-alt">
        <AppImage src={offer.imageUrl} alt={offer.name} fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
      </div>

      <div className="p-4">
        <p className="text-sm font-medium text-primary">{offer.categoryLabel}</p>
        <h2 className="font-semibold">{offer.name}</h2>
        <p className="text-sm text-muted">
          {offer.supplier} · {offer.transmission}
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-muted">Pick-up</dt>
            <dd className="font-medium">{search.location}</dd>
            <dd className="text-muted">
              {formatShortDate(search.pickupDate ?? "")}, {search.pickupTime}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Drop-off</dt>
            <dd className="font-medium">{search.dropoffLocation ?? search.location}</dd>
            <dd className="text-muted">
              {formatShortDate(search.dropoffDate ?? "")}, {search.dropoffTime}
            </dd>
          </div>
        </dl>

        <ul className="mt-3 flex flex-col gap-1 text-sm">
          <li className="flex items-center gap-2 text-ink-soft">
            <Icon name="users" />
            {formatCount(offer.seats, "seat")}, {formatCount(offer.bags, "bag")}
          </li>
          <li className={offer.hasUnlimitedMileage ? "text-success" : "text-muted"}>
            {offer.hasUnlimitedMileage ? "Unlimited mileage" : "Limited mileage"}
          </li>
          {offer.freeCancellation && <li className="text-success">Free cancellation</li>}
          {!search.isStandardAge && <li className="text-ink-soft">Includes young or senior driver fee</li>}
        </ul>

        <dl className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">
              {formatPrice(offer.pricePerDay, offer.currency)} x {formatCount(days, "day")}
            </dt>
            <dd>{formatPrice(offer.totalPrice, offer.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Taxes and fees</dt>
            <dd>Included</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="text-2xl font-bold text-primary">{formatPrice(offer.totalPrice, offer.currency)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
};

export default CarBookingSummary;
