import { formatCount } from "@/lib";
import type { PackageOffer } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import StarRating from "../ui/StarRating";
import Price from "../ui/Price";

type PackageOfferCardProps = {
  offer: PackageOffer;
  bookHref: string;
  travelers: number;
};

const PackageOfferCard = ({ offer, bookHref, travelers }: PackageOfferCardProps) => {
  const { hotel, room, currency } = offer;

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card sm:flex-row">
      <div className="relative aspect-[16/9] shrink-0 bg-surface-alt sm:aspect-auto sm:w-56">
        <AppImage src={hotel.imageUrl} alt={hotel.name} fill sizes="(min-width: 640px) 14rem, 100vw" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1 p-4">
        <p className="text-xs text-muted">
          {hotel.area}, {hotel.city}
        </p>
        <h3 className="font-semibold">{hotel.name}</h3>
        <StarRating stars={hotel.stars} />
        <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
          <span className="rounded-sm bg-primary px-1 font-semibold text-white">{hotel.rating.toFixed(1)}/10</span>
          {formatCount(hotel.reviewCount, "review")}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{room.name}</p>
        <ul className="mt-1 flex flex-wrap gap-x-3 text-xs text-success">
          {room.freeCancellation && <li>Free cancellation</li>}
          {room.breakfastIncluded && <li>Breakfast included</li>}
        </ul>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line p-4 sm:w-48 sm:flex-col sm:items-stretch sm:justify-center sm:border-t-0 sm:border-l sm:text-right">
        <div>
          <p className="text-sm text-muted">
            <s><Price amount={offer.regularTotal} currency={currency} /></s>
          </p>
          <p className="text-2xl font-bold text-primary"><Price amount={offer.totalPrice} currency={currency} /></p>
          <p className="text-xs text-muted">total, {formatCount(travelers, "traveler")}</p>
          <p className="text-xs font-medium text-success">Save <Price amount={offer.discount} currency={currency} /></p>
        </div>
        <ButtonLink href={bookHref} size="sm">
          Select
        </ButtonLink>
      </div>
    </article>
  );
};

export default PackageOfferCard;
