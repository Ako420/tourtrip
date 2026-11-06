import { formatCount } from "@/lib";
import type { PackageOffer } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import Price from "../ui/Price";
import StarRating from "../ui/StarRating";

type PackageOfferCardProps = {
  offer: PackageOffer;
  bookHref: string;
  travelers: number;
};

const PackageOfferCard = ({ offer, bookHref, travelers }: PackageOfferCardProps) => {
  const { hotel, room, currency } = offer;

  return (
    <article className="flex flex-col overflow-hidden rounded-card bg-surface sm:flex-row">
      <div className="relative aspect-[16/9] shrink-0 bg-surface-alt sm:aspect-auto sm:w-59">
        <AppImage src={hotel.imageUrl} alt={hotel.name} fill sizes="(min-width: 640px) 15rem, 100vw" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1 p-4">
        <h3 className="flex flex-wrap items-center gap-x-3 text-lg font-semibold">
          {hotel.name}
          <StarRating stars={hotel.stars} />
        </h3>
        <p className="mt-1 text-sm text-ink-soft">
          {hotel.area}, {hotel.city}
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-primary px-2 py-0.5 text-sm font-semibold text-white">{hotel.rating.toFixed(1)}/10</span>
          {formatCount(hotel.reviewCount, "review")}
        </p>

        <div className="mt-3 flex flex-col justify-between gap-3 rounded-card bg-surface-alt p-3 sm:flex-row">
          <div className="min-w-0 text-sm">
            <p className="font-bold">{room.name}</p>
            {room.freeCancellation && <p className="mt-1 font-medium text-success">Free cancellation</p>}
            {room.breakfastIncluded && <p className="mt-1 font-medium text-success">Breakfast included</p>}
          </div>

          <div className="shrink-0 sm:text-right">
            <div className="flex gap-6 sm:justify-end">
              <p className="text-sm text-ink-soft">
                Booked separately
                <span className="block font-bold"><Price amount={offer.regularTotal} currency={currency} /></span>
              </p>
              <p className="text-sm text-ink-soft">
                Flight + Hotel
                <span className="block font-bold text-primary"><Price amount={offer.totalPrice} currency={currency} /></span>
              </p>
            </div>
            <p className="mt-1 text-sm text-ink-soft">Total for {formatCount(travelers, "traveler")}</p>
            <p className="text-sm font-medium text-success">You save <Price amount={offer.discount} currency={currency} /></p>
            <ButtonLink href={bookHref} className="mt-2 w-full sm:w-auto">
              Select
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PackageOfferCard;
