import Link from "next/link";
import { formatCount, formatPrice } from "@/lib";
import type { HotelSummary } from "@/types";
import AppImage from "../ui/AppImage";
import FavoriteButton from "../ui/FavoriteButton";
import StarRating from "../ui/StarRating";

type HotelStayCardProps = {
  hotel: HotelSummary;
};

const HotelStayCard = ({ hotel }: HotelStayCardProps) => {
  return (
    <div className="relative h-full">
      <Link href={`/hotels/${hotel.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-line">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
          <AppImage
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            sizes="(min-width: 1024px) 18rem, 11rem"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <p className="text-xs text-muted">{hotel.city}</p>
          <h3 className="mt-0.5 line-clamp-2 font-semibold group-hover:text-primary">{hotel.name}</h3>
          <StarRating stars={hotel.stars} />
          <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
            <span className="rounded-sm bg-primary px-1 font-semibold text-white">{hotel.rating.toFixed(1)}/10</span>
            {formatCount(hotel.reviewCount, "review")}
          </p>
          <p className="mt-auto pt-3 font-bold">
            From{" "}
            {hotel.originalPrice && (
              <s className="mr-1 text-sm font-normal text-muted">{formatPrice(hotel.originalPrice, hotel.currency)}</s>
            )}
            {formatPrice(hotel.pricePerNight, hotel.currency)}
          </p>
        </div>
      </Link>
      <FavoriteButton label={hotel.name} />
    </div>
  );
};

export default HotelStayCard;
