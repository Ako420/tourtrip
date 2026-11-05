import { formatCount, formatPrice, formatTourLength } from "@/lib";
import type { TourDetails } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type TourHeaderProps = {
  tour: TourDetails;
};

const TourHeader = ({ tour }: TourHeaderProps) => {
  return (
    <>
      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-panel bg-surface-alt sm:aspect-[21/9]">
        <AppImage src={tour.imageUrl} alt={tour.name} fill priority sizes="100vw" className="object-cover" />
      </div>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{tour.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Icon name="location" />
              {tour.city}, {tour.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name="clock" />
              {formatTourLength(tour.days)}
            </span>
            <span className="flex items-center gap-1.5">
              <Icon name={tour.type === "private" ? "compass" : "users"} />
              {tour.type === "private" ? "Private tour" : "Group tour"}
            </span>
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded-md bg-primary px-1.5 py-0.5 font-semibold text-white">{tour.rating.toFixed(1)}/5</span>
            <span className="text-muted">{formatCount(tour.reviewCount, "review")}</span>
          </p>
          <p className="mt-3 max-w-2xl text-ink-soft">{tour.summary}</p>
        </div>

        <div className="flex w-full items-center justify-between gap-4 rounded-card border border-line p-4 sm:w-auto sm:flex-col sm:items-stretch sm:text-right">
          <p className="text-sm text-muted">
            From <span className="block text-2xl font-bold text-primary">{formatPrice(tour.price, tour.currency)}</span>
            per person
          </p>
          <ButtonLink href="#enquire">Enquire now</ButtonLink>
        </div>
      </header>
    </>
  );
};

export default TourHeader;
