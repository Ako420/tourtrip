import Link from "next/link";
import { PACKAGE_DISCOUNT } from "@/constants";
import { formatShortDate, toPackageBookHref } from "@/lib";
import type { PackageDeal } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import Price from "../ui/Price";
import StarRating from "../ui/StarRating";

type PackageDealCardProps = {
  deal: PackageDeal;
};

const PackageDealCard = ({ deal: { search, offer } }: PackageDealCardProps) => {
  return (
    <Link
      href={toPackageBookHref(search, offer)}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface"
    >
      <div className="relative grid h-42 grid-cols-[3fr_2fr]">
        <div className="relative overflow-hidden bg-surface-alt">
          <AppImage
            src={offer.hotel.imageUrl}
            alt={offer.hotel.name}
            fill
            sizes="(min-width: 1024px) 14rem, 12rem"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-1 bg-primary-deep px-3 text-center text-white">
          <span className="font-bold">{search.from}</span>
          <Icon name="swap" className="rotate-90 text-sm" />
          <span className="font-bold">{search.to}</span>
          <span className="mt-2 text-xs">{offer.flight.airline}</span>
        </div>
        <span
          aria-hidden
          className="absolute top-1/2 left-[60%] flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-sm text-ink"
        >
          <Icon name="plus" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="flex items-center gap-2 font-medium">
          {search.from}
          <Icon name="swap" className="text-xs" />
          {search.to}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          {formatShortDate(search.departDate ?? "")} - {formatShortDate(search.returnDate ?? "")}
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-2 font-medium group-hover:text-primary">
          {offer.hotel.name}
          <StarRating stars={offer.hotel.stars} />
        </p>

        <div className="mt-auto pt-3 text-right">
          <p className="flex items-center justify-end gap-2 text-sm text-promo">
            <Icon name="plane" />
            +
            <Icon name="bed" />
            <span className="rounded-sm bg-promo px-1.5 py-0.5 text-xs font-semibold text-white">
              {PACKAGE_DISCOUNT * 100}% off
            </span>
          </p>
          <p className="mt-1 flex items-baseline justify-end gap-2">
            <s className="text-sm text-muted"><Price amount={offer.regularTotal} currency={offer.currency} /></s>
            <span className="text-xl font-bold"><Price amount={offer.totalPrice} currency={offer.currency} /></span>
          </p>
          <p className="text-sm text-ink-soft">Per person</p>
        </div>
      </div>
    </Link>
  );
};

export default PackageDealCard;
