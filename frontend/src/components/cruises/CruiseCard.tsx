import Link from "next/link";
import { formatCount, formatShortDate } from "@/lib";
import type { CruiseListing } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type CruiseCardProps = {
  cruise: CruiseListing;
};

const CruiseCard = ({ cruise }: CruiseCardProps) => {
  return (
    <Link
      href={`/cruises/${cruise.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-alt">
        <AppImage
          src={cruise.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Icon name="ship" />
          {cruise.line}
        </p>
        <h3 className="mt-1 font-semibold group-hover:text-primary">{cruise.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {formatCount(cruise.nights, "night")} · {cruise.route.join(" - ")}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <span className="font-semibold text-primary">{cruise.rating}/5</span>
          {formatCount(cruise.reviewCount, "review")}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="text-xs text-muted">Next: {formatShortDate(cruise.nextSailingDate)}</p>
          <p className="text-sm text-muted">
            From <span className="text-lg font-bold text-ink"><Price amount={cruise.price} currency={cruise.currency} /></span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CruiseCard;
