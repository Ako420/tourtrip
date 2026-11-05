import Link from "next/link";
import { formatCount } from "@/lib";
import type { Attraction } from "@/types";
import AppImage from "../ui/AppImage";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type AttractionCardProps = {
  attraction: Attraction;
};

const AttractionCard = ({ attraction }: AttractionCardProps) => {
  return (
    <div className="relative h-full">
      <Link
        href={`/attractions/${attraction.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
          <AppImage
            src={attraction.imageUrl}
            alt={attraction.name}
            fill
            sizes="(min-width: 1024px) 18rem, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <p className="flex items-center gap-1 text-xs text-muted">
            <Icon name="location" />
            {attraction.city}
          </p>
          <h3 className="mt-0.5 line-clamp-2 font-semibold transition-colors duration-300 ease-out group-hover:text-primary">
            {attraction.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <span className="font-semibold text-primary">{attraction.rating}/5</span>
            {formatCount(attraction.reviewCount, "review")}
          </p>
          <p className="mt-1 text-xs text-muted">{attraction.duration}</p>
          {attraction.freeCancellation && <p className="text-xs text-success">Free cancellation</p>}
          <p className="mt-auto pt-3 text-sm text-muted">
            From{" "}
            <span className="text-lg font-bold text-ink"><Price amount={attraction.price} currency={attraction.currency} /></span>
          </p>
        </div>
      </Link>
      <FavoriteButton label={attraction.name} />
    </div>
  );
};

export default AttractionCard;
