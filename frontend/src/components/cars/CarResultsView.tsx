"use client";

import { useState } from "react";
import { carSortOptions } from "@/constants";
import { useCarFilters } from "@/hooks";
import { countCarFilters, formatCount, toCarQuery } from "@/lib";
import type { CarFilters, CarSearch, CarSearchResult, CarSort } from "@/types";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import StatusMessage from "../ui/StatusMessage";
import CarFilterPanel from "./CarFilterPanel";
import CarOfferCard from "./CarOfferCard";

type CarResultsViewProps = {
  search: CarSearch;
  filters: CarFilters;
  result: CarSearchResult;
};

const CarResultsView = ({ search, filters, result }: CarResultsViewProps) => {
  const { isPending, updateFilters, goToPage, clearFilters } = useCarFilters(search, filters);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeCount = countCarFilters(filters);
  const clearButton = activeCount > 0 && (
    <button type="button" onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">
      Clear all
    </button>
  );

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside
        aria-label="Filters"
        className={`fixed inset-0 z-50 overflow-y-auto bg-surface p-4 lg:static lg:z-auto lg:block lg:overflow-visible lg:p-0 ${
          isPanelOpen ? "block" : "hidden"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Filters</h2>
          {clearButton}
        </div>
        <CarFilterPanel filters={filters} suppliers={result.suppliers} onChange={updateFilters} />
        <Button type="button" onClick={() => setIsPanelOpen(false)} className="sticky bottom-0 mt-4 w-full lg:hidden">
          Show {formatCount(result.total, "car")}
        </Button>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold" aria-live="polite">
            {formatCount(result.total, "car")} in {search.location}
            <span className="ml-2 text-sm font-normal text-muted">{formatCount(result.days, "day")}</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPanelOpen(true)}
              className="flex h-10 items-center gap-2 rounded-md border border-line px-3 text-sm font-medium lg:hidden"
            >
              <Icon name="filter" />
              Filters{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only sm:not-sr-only sm:text-muted">Sort by</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as CarSort })}
                className="h-10 rounded-md border border-line bg-surface px-2 font-medium outline-none focus:border-primary"
              >
                {carSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {!search.isStandardAge && (
          <p className="mb-4 rounded-md bg-accent-soft p-3 text-sm">
            Prices include a young or senior driver fee for drivers outside ages 25 to 69.
          </p>
        )}

        <div className={`transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}>
          {result.items.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {result.items.map((offer) => (
                <li key={offer.id}>
                  <CarOfferCard
                    offer={offer}
                    days={result.days}
                    bookHref={`/cars/book?${toCarQuery(search)}&offer=${offer.id}`}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <StatusMessage iconName="car" title="No cars found" description="Try removing a filter to see more cars.">
              {clearButton}
            </StatusMessage>
          )}

          <Pagination page={result.page} pageCount={result.pageCount} onChange={goToPage} />
        </div>
      </div>
    </div>
  );
};

export default CarResultsView;
