import Link from "next/link";
import { formatCount, formatTourLength } from "@/lib";
import type { Tour } from "@/types";
import AppImage from "../ui/AppImage";
import Price from "../ui/Price";

type TourCardProps = {
  tour: Tour;
};

const TourCard = ({ tour }: TourCardProps) => {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-alt">
        <AppImage
          src={tour.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
          {formatTourLength(tour.days)} · {tour.name}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-ink-soft">
          <span className="rounded-full bg-primary px-2 font-semibold text-white">{tour.rating}/5</span>
          ({formatCount(tour.reviewCount, "review")})
        </p>
        <p className="mt-auto pt-4 text-right text-xs text-muted">
          From <span className="text-xl font-bold text-ink"><Price amount={tour.price} currency={tour.currency} /></span>
        </p>
      </div>
    </Link>
  );
};

export default TourCard;
