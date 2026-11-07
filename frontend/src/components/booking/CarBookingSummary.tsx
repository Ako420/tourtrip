import { formatCount, formatPrice, formatShortDate, getRentalDays } from "@/lib";
import type { CarOffer, CarSearch } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import ChargeNotice from "./ChargeNotice";

type CarBookingSummaryProps = {
  offer: CarOffer;
  search: CarSearch;
};

const CarBookingSummary = ({ offer, search }: CarBookingSummaryProps) => {
  const days = getRentalDays(search);
  const total = formatPrice(offer.totalPrice, offer.currency);
  const included = [
    formatCount(offer.seats, "seat"),
    formatCount(offer.bags, "bag"),
    offer.transmission,
    offer.hasUnlimitedMileage ? "Unlimited mileage" : "Limited mileage",
  ];

  return (
    <aside aria-label="Booking summary" className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-card bg-surface">
        <div className="relative aspect-[16/9] bg-surface-alt">
          <AppImage src={offer.imageUrl} alt={offer.name} fill sizes="(min-width: 1024px) 19rem, 100vw" className="object-cover" />
        </div>

        <div className="p-4 text-sm">
          <h2 className="font-bold">{offer.name}</h2>
          <p>{offer.categoryLabel}</p>
          <p className="mt-3">
            {formatShortDate(search.pickupDate ?? "")}, {search.pickupTime} - {formatShortDate(search.dropoffDate ?? "")},{" "}
            {search.dropoffTime} · {formatCount(days, "day")}
          </p>
          <p className="mt-2">
            {search.dropoffLocation
              ? `Pick-up at ${search.location}, drop-off at ${search.dropoffLocation}`
              : `Pick-up and drop-off at ${search.location}`}
          </p>
          <p className="mt-3 font-medium">{offer.supplier}</p>
          {offer.freeCancellation && (
            <p className="mt-2 flex items-center gap-2 text-success">
              <Icon name="check" />
              Free cancellation
            </p>
          )}
        </div>
      </div>

      <div className="rounded-card bg-surface p-4">
        <h2 className="text-2xl font-bold">Price details</h2>
        <p className="mt-3 flex items-baseline justify-between gap-4 font-bold">
          <span className="text-lg">Pay at the counter</span>
          <span className="text-lg text-primary">{total}</span>
        </p>

        <div className="mt-3 border-t border-line pt-3 text-sm">
          <p className="flex justify-between gap-4 font-medium">
            Car rental fee
            <span>{total}</span>
          </p>
          <p className="text-ink-soft">
            {formatPrice(offer.pricePerDay, offer.currency)} × {formatCount(days, "day")}
          </p>
          <ul className="mt-2 flex flex-col gap-1">
            {included.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {!search.isStandardAge && <li>Young or senior driver fee</li>}
          </ul>
          <p className="mt-3 flex justify-between gap-4 border-t border-line pt-3 font-medium">
            Taxes and fees
            <span>Included</span>
          </p>
        </div>
        <ChargeNotice />
      </div>
    </aside>
  );
};

export default CarBookingSummary;
