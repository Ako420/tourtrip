import { formatCount, getRatingLabel } from "@/lib";
import type { AttractionDetails } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type AttractionHeaderProps = {
  attraction: AttractionDetails;
};

const AttractionHeader = ({ attraction }: AttractionHeaderProps) => {
  return (
    <>
      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-panel bg-surface-alt sm:aspect-[21/9]">
        <AppImage src={attraction.imageUrl} alt={attraction.name} fill priority sizes="100vw" className="object-cover" />
        <FavoriteButton label={attraction.name} />
      </div>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{attraction.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Icon name="location" />
              {attraction.city}, {attraction.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="clock" />
              {attraction.duration}
            </span>
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded-md bg-primary px-1.5 py-0.5 font-semibold text-white">
              {attraction.rating.toFixed(1)}/5
            </span>
            <span className="font-medium">{getRatingLabel(attraction.rating * 2)}</span>
            <a href="#reviews" className="text-primary hover:underline">
              {formatCount(attraction.reviewCount, "review")}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted">From</p>
            <p className="text-2xl font-bold text-primary"><Price amount={attraction.price} currency={attraction.currency} /></p>
            <p className="text-xs text-muted">per adult</p>
          </div>
          <ButtonLink href="#tickets">See tickets</ButtonLink>
        </div>
      </header>
    </>
  );
};

export default AttractionHeader;
