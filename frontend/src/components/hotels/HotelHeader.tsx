import { formatCount, formatPrice, getRatingLabel } from "@/lib";
import type { HotelDetails } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";

type HotelHeaderProps = {
  hotel: HotelDetails;
};

const HotelHeader = ({ hotel }: HotelHeaderProps) => {
  const availablePrices = hotel.rooms.filter((room) => room.isAvailable).map((room) => Number(room.pricePerNight));

  return (
    <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3 pr-1">
          <h1 className="text-2xl font-bold sm:text-3xl">{hotel.name}</h1>
          <StarRating stars={hotel.stars} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
          <Icon name="location" />
          {hotel.address}, {hotel.city}, {hotel.country}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-md bg-primary px-1.5 py-0.5 font-semibold text-white">{hotel.rating.toFixed(1)}</span>
          <span className="font-medium">{getRatingLabel(hotel.rating)}</span>
          <a href="#reviews" className="text-primary hover:underline">
            {formatCount(hotel.reviewCount, "review")}
          </a>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative size-9">
          <div className="absolute -top-3 -right-3">
            <FavoriteButton label={hotel.name} />
          </div>
        </div>
        {availablePrices.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-muted">From</p>
            <p className="text-2xl font-bold text-primary">{formatPrice(Math.min(...availablePrices), hotel.currency)}</p>
            <p className="text-xs text-muted">per night</p>
          </div>
        )}
        <ButtonLink href="#rooms">Select a room</ButtonLink>
      </div>
    </header>
  );
};

export default HotelHeader;
