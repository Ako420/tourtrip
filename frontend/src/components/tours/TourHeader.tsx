import { tourTypeLabels } from "@/constants";
import { formatCount, formatTourLength, getRatingLabel } from "@/lib";
import type { TourDetails } from "@/types";
import AppImage from "../ui/AppImage";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";

type TourHeaderProps = {
  tour: TourDetails;
};

const TourHeader = ({ tour }: TourHeaderProps) => {
  const facts = [
    { iconName: "location", label: `${tour.city}, ${tour.country}` },
    { iconName: "clock", label: formatTourLength(tour.days) },
    { iconName: tour.type === "private" ? "compass" : "users", label: tourTypeLabels[tour.type] },
  ] as const;

  return (
    <div className="rounded-card bg-surface p-6">
      <header>
        <h1 className="type-section font-bold">{tour.name}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-primary-deep px-2 py-0.5 font-bold text-white">{tour.rating.toFixed(1)}/5</span>
          <span className="font-medium text-primary">{getRatingLabel(tour.rating * 2)}</span>
          <span className="text-ink-soft">{formatCount(tour.reviewCount, "review")}</span>
        </p>
      </header>

      <div className="relative mt-4 h-56 overflow-hidden rounded-card bg-surface-alt sm:h-96">
        <AppImage src={tour.imageUrl} alt={tour.name} fill priority sizes="(min-width: 1024px) 45rem, 100vw" className="object-cover" />
        <FavoriteButton label={tour.name} />
      </div>

      <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        {facts.map((fact) => (
          <li key={fact.label} className="flex items-center gap-3">
            <Icon name={fact.iconName} className="w-4" />
            {fact.label}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 type-section font-bold">Highlights</h2>
      <p className="mt-3 text-sm text-ink-soft">{tour.summary}</p>
    </div>
  );
};

export default TourHeader;
