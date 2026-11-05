import { cruisesPath } from "@/constants";
import { formatCount, formatShortDate, toCruiseHref } from "@/lib";
import type { CruiseFilters, CruiseSearchResult } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import LinkTabs from "../ui/LinkTabs";
import StatusMessage from "../ui/StatusMessage";
import CruiseGrid from "./CruiseGrid";

type CruiseResultsProps = {
  result: CruiseSearchResult;
  filters: CruiseFilters;
};

const getTitle = ({ query, date }: CruiseFilters) => {
  if (query && date) return `Cruises for "${query}" from ${formatShortDate(date)}`;
  if (query) return `Cruises for "${query}"`;
  if (date) return `Cruises from ${formatShortDate(date)}`;

  return "Popular cruises";
};

const CruiseResults = ({ result, filters }: CruiseResultsProps) => {
  const options = [{ label: "All lines", line: undefined }, ...result.lines.map((line) => ({ label: line, line }))];

  return (
    <section className="mx-auto max-w-content">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="type-section font-bold">{getTitle(filters)}</h2>
        <p className="text-sm text-muted" aria-live="polite">
          {formatCount(result.items.length, "cruise")}
        </p>
      </div>

      <LinkTabs
        label="Filter cruises by line"
        tabs={options.map(({ label, line }) => ({
          label,
          href: toCruiseHref({ ...filters, line }),
          isActive: line === filters.line,
        }))}
      />

      <div className="mt-5">
        {result.items.length > 0 ? (
          <CruiseGrid cruises={result.items} />
        ) : (
          <StatusMessage iconName="ship" title="No cruises found" description="Try another destination, or a different date.">
            <ButtonLink href={cruisesPath}>See all cruises</ButtonLink>
          </StatusMessage>
        )}
      </div>
    </section>
  );
};

export default CruiseResults;
