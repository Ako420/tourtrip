import Link from "next/link";
import { formatCount } from "@/lib";
import type { Attraction } from "@/types";
import AppImage from "../ui/AppImage";
import FavoriteButton from "../ui/FavoriteButton";
import Price from "../ui/Price";

type AttractionCardProps = {
  attraction: Attraction;
};

const tagClass = "rounded-sm bg-surface-alt px-1.5 py-0.5 text-xs text-ink-soft";

const AttractionCard = ({ attraction }: AttractionCardProps) => {
  return (
    <div className="relative h-full">
      <Link
        href={`/attractions/${attraction.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface"
      >
        <div className="relative aspect-video overflow-hidden bg-surface-alt">
          <AppImage
            src={attraction.imageUrl}
            alt={attraction.name}
            fill
            sizes="(min-width: 1024px) 18rem, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 font-semibold transition-colors duration-300 ease-out group-hover:text-primary">
            {attraction.name}
          </h3>
          <p className="mt-1 flex items-baseline gap-1.5 text-sm text-ink-soft">
            <span className="text-primary">
              <span className="font-bold">{attraction.rating}</span>/5
            </span>
            {formatCount(attraction.reviewCount, "review")}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className={tagClass}>{attraction.duration}</span>
            {attraction.freeCancellation && <span className={tagClass}>Free cancellation</span>}
          </div>
          <p className="mt-2 text-sm text-ink-soft">{attraction.city}</p>
          <p className="mt-auto pt-3 text-right text-sm text-ink-soft">
            From{" "}
            <span className="text-xl font-bold text-primary"><Price amount={attraction.price} currency={attraction.currency} /></span>
          </p>
        </div>
      </Link>
      <FavoriteButton label={attraction.name} />
    </div>
  );
};

export default AttractionCard;
