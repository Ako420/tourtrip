import { formatCount, getRatingLabel } from "@/lib";
import type { CruiseDetails } from "@/types";
import AppImage from "../ui/AppImage";
import FavoriteButton from "../ui/FavoriteButton";
import Icon from "../ui/Icon";
import CruiseDeparture from "./CruiseDeparture";

type CruiseHeaderProps = {
  cruise: CruiseDetails;
};

const CruiseHeader = ({ cruise }: CruiseHeaderProps) => {
  return (
    <div className="mt-4 grid gap-5 rounded-card bg-surface p-4 lg:grid-cols-[35rem_minmax(0,1fr)]">
      <div className="relative h-56 overflow-hidden rounded-card bg-surface-alt sm:h-85 lg:h-auto lg:min-h-85">
        <AppImage src={cruise.imageUrl} alt={cruise.name} fill priority sizes="(min-width: 1024px) 35rem, 100vw" className="object-cover" />
        <FavoriteButton label={cruise.name} />
      </div>

      <div className="flex min-w-0 flex-col">
        <h1 className="text-2xl font-bold">{cruise.name}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 font-bold text-primary">
            <Icon name="ship" />
            {cruise.line}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="location" />
            {cruise.destination}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="clock" />
            {formatCount(cruise.nights, "night")}
          </span>
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-primary-deep px-2 py-0.5 font-bold text-white">{cruise.rating.toFixed(1)}/5</span>
          <span className="font-medium text-primary">{getRatingLabel(cruise.rating * 2)}</span>
          <span className="text-ink-soft">{formatCount(cruise.reviewCount, "review")}</span>
        </p>

        <CruiseDeparture cruise={cruise} />
      </div>
    </div>
  );
};

export default CruiseHeader;
