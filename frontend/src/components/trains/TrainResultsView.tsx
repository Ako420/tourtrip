"use client";

import { useState } from "react";
import { useTrainFilters } from "@/hooks";
import { addDays, countTrainFilters, formatCount, toTrainQuery } from "@/lib";
import type { TrainFilters, TrainSearch, TrainSearchResult } from "@/types";
import DateStrip from "../flights/DateStrip";
import FlightSortTabs from "../flights/FlightSortTabs";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import StatusMessage from "../ui/StatusMessage";
import TrainFilterPanel from "./TrainFilterPanel";
import TrainOfferCard from "./TrainOfferCard";

type TrainResultsViewProps = {
  search: TrainSearch;
  filters: TrainFilters;
  result: TrainSearchResult;
};

const TrainResultsView = ({ search, filters, result }: TrainResultsViewProps) => {
  const { isPending, updateFilters, goToPage, clearFilters, changeDates } = useTrainFilters(search, filters);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeCount = countTrainFilters(filters);
  const clearButton = activeCount > 0 && (
    <button type="button" onClick={clearFilters} className="text-sm font-medium text-primary hover:underline">
      Clear all
    </button>
  );

  const handleDateSelect = (departDate: string) => {
    const isReturnTooEarly = search.returnDate !== undefined && search.returnDate <= departDate;

    changeDates({ departDate, returnDate: isReturnTooEarly ? addDays(departDate, 1) : search.returnDate });
  };

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
        <TrainFilterPanel filters={filters} result={result} onChange={updateFilters} />
        <Button type="button" onClick={() => setIsPanelOpen(false)} className="sticky bottom-0 mt-4 w-full lg:hidden">
          Show {formatCount(result.total, "train")}
        </Button>
      </aside>

      <div className="min-w-0">
        <DateStrip
          days={result.fareCalendar}
          selectedDate={search.departDate}
          currency={result.currency}
          onSelect={handleDateSelect}
        />

        <div className="mt-4 mb-3 flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold" aria-live="polite">
            {search.from} to {search.to}
            <span className="ml-2 text-sm font-normal text-muted">{formatCount(result.total, "train")}</span>
          </h1>
          <button
            type="button"
            onClick={() => setIsPanelOpen(true)}
            className="flex h-10 shrink-0 items-center gap-2 rounded-md border border-line px-3 text-sm font-medium lg:hidden"
          >
            <Icon name="filter" />
            Filters{activeCount > 0 && ` (${activeCount})`}
          </button>
        </div>

        <FlightSortTabs value={filters.sort} summary={result.sortSummary} currency={result.currency} onChange={(sort) => updateFilters({ sort })} />

        <div className={`mt-4 transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}>
          {result.items.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {result.items.map((offer) => (
                <li key={offer.id}>
                  <TrainOfferCard
                    offer={offer}
                    bookHref={`/trains/book?${toTrainQuery(search)}&offer=${offer.id}`}
                    travelers={search.adults + search.children}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <StatusMessage iconName="train" title="No trains found" description="Try removing a filter or changing your dates.">
              {clearButton}
            </StatusMessage>
          )}

          <Pagination page={result.page} pageCount={result.pageCount} onChange={goToPage} />
        </div>
      </div>
    </div>
  );
};

export default TrainResultsView;
