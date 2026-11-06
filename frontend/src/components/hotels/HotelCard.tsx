import Link from "next/link";
import { formatCount, getRatingLabel } from "@/lib";
import type { HotelSummary } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";
import Price from "../ui/Price";

type HotelCardProps = {
  hotel: HotelSummary;
  query?: string;
  nights?: number;
  rooms?: number;
  isPriority?: boolean;
};

const getDiscount = ({ pricePerNight, originalPrice }: HotelSummary) => {
  return originalPrice ? Math.round((1 - Number(pricePerNight) / Number(originalPrice)) * 100) : 0;
};

const HotelCard = ({ hotel, query = "", nights = 0, rooms = 1, isPriority = false }: HotelCardProps) => {
  const href = `/hotels/${hotel.slug}${query && `?${query}`}`;
  const discount = getDiscount(hotel);

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line sm:flex-row">
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-alt sm:aspect-auto sm:w-59">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <AppImage
            src={hotel.imageUrl}
            alt=""
            fill
            priority={isPriority}
            sizes="(min-width: 640px) 15rem, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <FavoriteButton label={hotel.name} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5 sm:flex-row">
        <div className="min-w-0 flex-1">
          <h2 className="flex flex-wrap items-center gap-x-2 text-xl font-bold">
            <Link href={href} className="transition-colors duration-300 ease-out hover:text-primary">
              {hotel.name}
            </Link>
            <StarRating stars={hotel.stars} />
          </h2>

          <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
            <Icon name="location" />
            {hotel.area}, {hotel.city}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
            <Icon name="thumbs-up" />
            {hotel.amenities.slice(0, 3).map((amenity) => amenity.label).join(" · ")}
          </p>

          <div className="mt-3 ml-1 border-l border-line pl-4 text-sm leading-6">
            <p className="font-bold">{hotel.featuredRoom.name}</p>
            <p>{hotel.featuredRoom.beds}</p>
            {hotel.freeCancellation && <p className="text-success">Free cancellation</p>}
            {hotel.breakfastIncluded && <p className="text-success">Breakfast included</p>}
          </div>
        </div>

        <div className="flex shrink-0 flex-col justify-between gap-3 sm:w-44 sm:text-right">
          <div className="flex items-center gap-2 sm:justify-end">
            <div className="order-2 sm:order-1">
              <p className="font-semibold text-primary">{getRatingLabel(hotel.rating)}</p>
              <p className="text-xs text-ink-soft">{formatCount(hotel.reviewCount, "review")}</p>
            </div>
            <span className="order-1 rounded-lg bg-primary-deep px-2 py-1 font-semibold text-white sm:order-2">
              {hotel.rating.toFixed(1)}
            </span>
          </div>

          <div>
            <p className="flex items-baseline gap-2 sm:justify-end">
              {hotel.originalPrice && (
                <s className="text-sm text-muted"><Price amount={hotel.originalPrice} currency={hotel.currency} /></s>
              )}
              <span className="type-price font-bold text-primary"><Price amount={hotel.pricePerNight} currency={hotel.currency} /></span>
            </p>
            <p className="text-xs text-ink-soft">per night</p>
            {nights > 0 && (
              <p className="text-xs text-ink-soft">
                {formatCount(nights, "night")}, {formatCount(rooms, "room")}:{" "}
                <span className="font-semibold"><Price amount={Number(hotel.pricePerNight) * nights * rooms} currency={hotel.currency} /></span>
              </p>
            )}
            {discount > 0 && (
              <p className="mt-1 inline-block rounded-sm bg-promo-soft px-1.5 text-xs font-medium text-promo">
                {discount}% off
              </p>
            )}
          </div>

          <ButtonLink href={href} size="sm" className="w-full">
            Check availability
            <Icon name="chevron-right" className="text-xs" />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
