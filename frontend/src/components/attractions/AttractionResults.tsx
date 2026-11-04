"use client";

import { attractionCategories, attractionSortOptions } from "@/constants";
import { useAttractionFilters } from "@/hooks";
import { formatCount } from "@/lib";
import type { AttractionFilters, AttractionSearchResult, AttractionSort } from "@/types";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import StatusMessage from "../ui/StatusMessage";
import AttractionCard from "./AttractionCard";

type AttractionResultsProps = {
  title: string;
  filters: AttractionFilters;
  result: AttractionSearchResult;
};

const AttractionResults = ({ title, filters, result }: AttractionResultsProps) => {
  const { isPending, updateFilters, goToPage } = useAttractionFilters(filters);

  return (
    <section id="results" className="mx-auto mt-12 max-w-content scroll-mt-4">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-2xl font-bold sm:text-[1.75rem]">
          {filters.query ? `Things to do in "${filters.query}"` : title}
        </h2>
        <p className="text-sm text-muted" aria-live="polite">
          {formatCount(result.total, "result")}
        </p>
      </div>

      <div role="tablist" aria-label="Categories" className="scrollbar-none flex gap-2 overflow-x-auto">
        {attractionCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={filters.category === category.id}
            onClick={() => updateFilters({ category: category.id })}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
              filters.category === category.id ? "bg-primary text-white" : "bg-surface-alt text-ink-soft hover:text-primary"
            }`}
          >
            <Icon name={category.iconName} />
            {category.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.freeCancellation}
            onChange={() => updateFilters({ freeCancellation: !filters.freeCancellation })}
            className="size-4 accent-primary"
          />
          Free cancellation
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted">Sort by</span>
          <select
            value={filters.sort}
            onChange={(event) => updateFilters({ sort: event.target.value as AttractionSort })}
            className="h-10 rounded-md border border-line bg-surface px-2 font-medium outline-none focus:border-primary"
          >
            {attractionSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={`mt-4 transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}>
        {result.items.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {result.items.map((attraction) => (
              <li key={attraction.id}>
                <AttractionCard attraction={attraction} />
              </li>
            ))}
          </ul>
        ) : (
          <StatusMessage
            iconName="compass"
            title="Nothing found"
            description="Try another destination, or show all categories."
          >
            <Button type="button" onClick={() => updateFilters({ query: undefined, category: "all", freeCancellation: false })}>
              Show everything
            </Button>
          </StatusMessage>
        )}

        <Pagination page={result.page} pageCount={result.pageCount} onChange={goToPage} />
      </div>
    </section>
  );
};

export default AttractionResults;
