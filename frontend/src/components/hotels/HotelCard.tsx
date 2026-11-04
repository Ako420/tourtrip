import Link from "next/link";
import { formatCount, formatPrice, getRatingLabel } from "@/lib";
import type { HotelSummary } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";
import AmenityList from "./AmenityList";

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
    <article className="group flex flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card sm:flex-row">
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-alt sm:aspect-auto sm:w-56 md:w-64">
        <Link href={href} tabIndex={-1} aria-hidden className="absolute inset-0">
          <AppImage
            src={hotel.imageUrl}
            alt=""
            fill
            priority={isPriority}
            sizes="(min-width: 640px) 16rem, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <FavoriteButton label={hotel.name} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div>
          <h2 className="flex flex-wrap items-center gap-x-2 text-lg font-semibold">
            <Link href={href} className="transition-colors duration-300 ease-out hover:text-primary">
              {hotel.name}
            </Link>
            <StarRating stars={hotel.stars} />
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="location" />
            {hotel.area}, {hotel.city}
          </p>
        </div>

        <AmenityList amenities={hotel.amenities.slice(0, 3)} />

        <div className="mt-auto border-l-2 border-line pl-3 text-sm">
          <p className="font-medium">{hotel.featuredRoom.name}</p>
          <p className="text-muted">{hotel.featuredRoom.beds}</p>
          {hotel.freeCancellation && <p className="text-success">Free cancellation</p>}
          {hotel.breakfastIncluded && <p className="text-success">Breakfast included</p>}
        </div>
      </div>

      <div className="flex shrink-0 flex-col justify-between gap-3 border-t border-line p-4 sm:w-48 sm:border-t-0 sm:border-l sm:text-right">
        <div className="flex items-center gap-2 sm:justify-end">
          <div className="order-2 sm:order-1">
            <p className="text-sm font-semibold text-primary">{getRatingLabel(hotel.rating)}</p>
            <p className="text-xs text-muted">{formatCount(hotel.reviewCount, "review")}</p>
          </div>
          <span className="order-1 rounded-md bg-primary px-2 py-1 text-sm font-semibold text-white sm:order-2">
            {hotel.rating.toFixed(1)}
          </span>
        </div>

        <div>
          {hotel.originalPrice && (
            <p className="text-sm text-muted line-through">{formatPrice(hotel.originalPrice, hotel.currency)}</p>
          )}
          <p className="text-2xl font-bold text-primary">{formatPrice(hotel.pricePerNight, hotel.currency)}</p>
          <p className="text-xs text-muted">per night</p>
          {nights > 0 && (
            <p className="text-xs text-muted">
              {formatPrice(Number(hotel.pricePerNight) * nights * rooms, hotel.currency)} total for{" "}
              {formatCount(nights, "night")}, {formatCount(rooms, "room")}
            </p>
          )}
          {discount > 0 && (
            <p className="mt-1 inline-block rounded-sm bg-promo-soft px-1.5 text-xs font-medium text-promo">
              {discount}% off
            </p>
          )}
        </div>

        <ButtonLink href={href} size="sm" className="w-full">
          See rooms
        </ButtonLink>
      </div>
    </article>
  );
};

export default HotelCard;
