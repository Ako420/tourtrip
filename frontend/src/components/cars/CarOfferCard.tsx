import { formatCount, getRatingLabel } from "@/lib";
import type { CarOffer } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type CarOfferCardProps = {
  offer: CarOffer;
  bookHref: string;
  days: number;
};

const CarOfferCard = ({ offer, bookHref, days }: CarOfferCardProps) => {
  return (
    <article className="grid gap-x-6 gap-y-4 rounded-card bg-surface p-4 sm:grid-cols-[11.25rem_minmax(0,1fr)] sm:p-5">
      <div className="flex flex-col justify-between gap-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-surface-alt sm:aspect-auto sm:h-28">
          <AppImage src={offer.imageUrl} alt={offer.name} fill sizes="(min-width: 640px) 11.25rem, 100vw" className="object-cover" />
        </div>

        <div className="text-sm">
          <p className="font-bold">{offer.supplier}</p>
          <p className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-primary-deep px-2 text-xs font-semibold text-white">
              {offer.supplierRating.toFixed(1)}/10
            </span>
            <span className="text-primary">{getRatingLabel(offer.supplierRating)}</span>
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <h2 className="flex flex-wrap items-baseline gap-x-2 text-xl font-bold">
          {offer.name}
          <span className="text-sm font-normal">{offer.categoryLabel}</span>
        </h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <li className="flex items-center gap-1.5">
            <Icon name="user" className="text-ink-soft" />
            {formatCount(offer.seats, "seat")}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="suitcase" className="text-ink-soft" />
            {formatCount(offer.bags, "bag")}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="gears" className="text-ink-soft" />
            {offer.transmission}
          </li>
        </ul>

        <div className="mt-4 flex flex-col justify-between gap-4 border-t border-line pt-4 sm:flex-row sm:items-end">
          <ul className="space-y-1 text-sm">
            {offer.freeCancellation && (
              <li className="flex items-center gap-2 text-success">
                <Icon name="check" />
                Free cancellation
              </li>
            )}
            <li className="flex items-center gap-2">
              <Icon name="route" className="text-ink-soft" />
              {offer.hasUnlimitedMileage ? "Unlimited mileage" : "Limited mileage"}
            </li>
          </ul>

          <div className="flex shrink-0 items-end justify-between gap-4 sm:block sm:text-right">
            <div>
              <p>
                <span className="type-price font-bold"><Price amount={offer.pricePerDay} currency={offer.currency} /></span>
                <span className="ml-1 text-sm text-ink-soft">/day</span>
              </p>
              <p className="text-sm text-ink-soft">
                Total <Price amount={offer.totalPrice} currency={offer.currency} /> for {formatCount(days, "day")}
              </p>
            </div>
            <ButtonLink href={bookHref} className="sm:mt-2">
              View deal
              <Icon name="chevron-right" className="text-xs" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CarOfferCard;
