import Link from "next/link";
import { formatCount } from "@/lib";
import type { HotelSummary } from "@/types";
import AppImage from "../ui/AppImage";
import Price from "../ui/Price";
import StarRating from "../ui/StarRating";

type HotelShowcaseCardProps = {
  hotel: HotelSummary;
};

const HotelShowcaseCard = ({ hotel }: HotelShowcaseCardProps) => {
  return (
    <Link href={`/hotels/${hotel.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card border border-line">
      <div className="relative aspect-[3/2] bg-surface-alt">
        <span className="absolute inset-0 overflow-hidden">
          <AppImage
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            sizes="(min-width: 1024px) 18rem, 14rem"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </span>
        <span className="absolute bottom-2 left-3 rounded-full border border-primary bg-surface px-2 py-0.5 text-sm">
          <span className="font-semibold text-primary">{hotel.rating.toFixed(1)}/10</span>{" "}
          <span className="text-primary">{formatCount(hotel.reviewCount, "review")}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium group-hover:text-primary">{hotel.name}</h3>
        <StarRating stars={hotel.stars} />
        <p className="mt-1 text-sm text-ink-soft">
          {hotel.area}, {hotel.city}
        </p>
        <p className="mt-auto pt-3 text-right text-xs text-muted">
          From{" "}
          <span className="text-xl font-medium text-ink">
            <Price amount={hotel.pricePerNight} currency={hotel.currency} />
          </span>
        </p>
      </div>
    </Link>
  );
};

export default HotelShowcaseCard;
