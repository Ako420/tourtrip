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
      className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card"
    >
      <div className="relative h-49 overflow-hidden bg-surface-alt">
        <AppImage
          src={cruise.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent to-40%" />
        <span className="absolute inset-x-3 bottom-2 text-center text-sm font-semibold text-white">{cruise.line}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-bold group-hover:text-primary">
          {formatCount(cruise.nights, "night")} · {cruise.route.join(" - ")}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{cruise.name}</p>
        <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
          <Icon name="calendar" className="text-xs" />
          {formatShortDate(cruise.nextSailingDate)}
        </p>
        <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
          <Icon name="ship" className="text-xs" />
          {cruise.route[0]}
        </p>
        <p className="mt-auto pt-2 text-sm text-muted">
          From <span className="text-lg font-bold text-ink"><Price amount={cruise.price} currency={cruise.currency} /></span>
        </p>
      </div>
    </Link>
  );
};

export default CruiseCard;
