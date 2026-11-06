import { attractionCategories } from "@/constants";
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
  const category = attractionCategories.find((item) => item.id === attraction.category);

  return (
    <div className="mt-4 rounded-card bg-surface p-4">
      <div className="relative h-56 overflow-hidden rounded-card bg-surface-alt sm:h-90">
        <AppImage src={attraction.imageUrl} alt={attraction.name} fill priority sizes="(min-width: 1280px) 72rem, 100vw" className="object-cover" />
        <FavoriteButton label={attraction.name} />
      </div>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 lg:max-w-2xl">
          <h1 className="type-section font-bold">{attraction.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <Icon name="location" />
            {attraction.city}, {attraction.country}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-ink-soft">
              From{" "}
              <span className="text-2xl font-bold text-primary">
                <Price amount={attraction.price} currency={attraction.currency} />
              </span>
            </p>
            <p className="text-sm text-ink-soft">per adult</p>
          </div>
          <ButtonLink href="#tickets" size="lg">
            See tickets
          </ButtonLink>
        </div>
      </header>

      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {category && <li className="rounded-md bg-surface-alt px-2 py-1">{category.label}</li>}
        <li className="rounded-md bg-surface-alt px-2 py-1">{attraction.duration}</li>
      </ul>

      {attraction.freeCancellation && (
        <p className="mt-3 flex w-fit items-center gap-2 rounded-md bg-primary-soft px-2 py-1 text-sm text-success">
          <Icon name="check" />
          Free cancellation
        </p>
      )}

      <p className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-primary-deep px-2 py-0.5 font-bold text-white">{attraction.rating.toFixed(1)}/5</span>
        <span className="text-xl font-medium text-primary">{getRatingLabel(attraction.rating * 2)}</span>
        <a href="#reviews" className="text-sm text-primary underline">
          {formatCount(attraction.reviewCount, "review")}
        </a>
      </p>

      <div className="mt-4 rounded-card bg-primary-soft p-4">
        <h2 className="font-bold">Highlights</h2>
        <ul className="mt-2 space-y-1.5 text-sm">
          {attraction.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2">
              <Icon name="check" className="mt-0.5 text-primary" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AttractionHeader;
