import { tourPaths } from "@/constants";
import { formatCount } from "@/lib";
import type { Tour, TourType } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import StatusMessage from "../ui/StatusMessage";
import TourGrid from "./TourGrid";

type TourResultsProps = {
  type: TourType;
  tours: Tour[];
  query?: string;
};

const TourResults = ({ type, tours, query }: TourResultsProps) => {
  return (
    <section className="mx-auto max-w-content">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="type-section font-bold">{query ? `Tours for "${query}"` : "Recommended tours"}</h2>
        <p className="text-sm text-muted" aria-live="polite">
          {formatCount(tours.length, "tour")}
        </p>
      </div>

      {tours.length > 0 ? (
        <TourGrid tours={tours} />
      ) : (
        <StatusMessage iconName="compass" title="No tours found" description="Try another place, or see all our tours.">
          <ButtonLink href={tourPaths[type]}>See all tours</ButtonLink>
        </StatusMessage>
      )}
    </section>
  );
};

export default TourResults;
