import { formatCount } from "@/lib";
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
    <article className="flex flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card sm:flex-row">
      <div className="relative aspect-[16/9] shrink-0 bg-surface-alt sm:aspect-auto sm:w-56">
        <AppImage src={offer.imageUrl} alt={offer.name} fill sizes="(min-width: 640px) 14rem, 100vw" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1 p-4">
        <p className="text-sm font-medium text-primary">{offer.categoryLabel}</p>
        <h2 className="text-lg font-semibold">{offer.name}</h2>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <li className="flex items-center gap-1.5">
            <Icon name="users" />
            {formatCount(offer.seats, "seat")}
          </li>
          <li>{formatCount(offer.bags, "bag")}</li>
          <li>{offer.transmission}</li>
        </ul>
        <ul className="mt-2 text-sm">
          <li className={offer.hasUnlimitedMileage ? "text-success" : "text-muted"}>
            {offer.hasUnlimitedMileage ? "Unlimited mileage" : "Limited mileage"}
          </li>
          {offer.freeCancellation && <li className="text-success">Free cancellation</li>}
        </ul>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-sm bg-primary px-1 text-xs font-semibold text-white">{offer.supplierRating.toFixed(1)}</span>
          {offer.supplier}
        </p>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line p-4 sm:w-44 sm:flex-col sm:items-stretch sm:justify-center sm:border-t-0 sm:border-l sm:text-right">
        <div>
          <p className="text-2xl font-bold text-primary"><Price amount={offer.totalPrice} currency={offer.currency} /></p>
          <p className="text-xs text-muted">
            total for {formatCount(days, "day")} · <Price amount={offer.pricePerDay} currency={offer.currency} /> per day
          </p>
        </div>
        <ButtonLink href={bookHref} size="sm">
          Select
        </ButtonLink>
      </div>
    </article>
  );
};

export default CarOfferCard;
