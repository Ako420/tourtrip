import Link from "next/link";
import type { HotelDetails } from "@/types";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";

type HotelHeaderProps = {
  hotel: HotelDetails;
};

const HotelHeader = ({ hotel }: HotelHeaderProps) => {
  return (
    <header className="mt-5">
      <Link
        href={`/hotels/list?destination=${encodeURIComponent(hotel.city)}`}
        className="flex w-fit items-center gap-2 text-sm text-ink-soft transition-colors duration-300 ease-out hover:text-primary"
      >
        <Icon name="chevron-left" className="text-xs" />
        All properties in {hotel.city}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3">
            <h1 className="type-section font-bold">{hotel.name}</h1>
            <StarRating stars={hotel.stars} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
            <Icon name="location" />
            {hotel.address}, {hotel.city}, {hotel.country}
            <a href="#location" className="font-medium underline hover:text-primary">
              Show on map
            </a>
          </p>
        </div>

        <div className="relative size-9 shrink-0">
          <div className="absolute -top-3 -right-3">
            <FavoriteButton label={hotel.name} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HotelHeader;
