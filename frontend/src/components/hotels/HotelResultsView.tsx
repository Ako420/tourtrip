"use client";

import { useState } from "react";
import { useHotelFilters } from "@/hooks";
import { countActiveFilters, formatCount, nightsBetween, toSearchQuery } from "@/lib";
import type { HotelFilters, HotelSearch, HotelSearchResult } from "@/types";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import StatusMessage from "../ui/StatusMessage";
import BookingOffers from "./BookingOffers";
import FilterPanel from "./FilterPanel";
import HotelCard from "./HotelCard";
import HotelSortSelect from "./HotelSortSelect";

type HotelResultsViewProps = {
  search: HotelSearch;
  filters: HotelFilters;
  result: HotelSearchResult;
};

const HotelResultsView = ({ search, filters, result }: HotelResultsViewProps) => {
  const { isPending, updateFilters, goToPage, clearFilters } = useHotelFilters(search, filters);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const activeCount = countActiveFilters(filters);
  const nights = search.checkIn && search.checkOut ? nightsBetween(search.checkIn, search.checkOut) : 0;
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
        <FilterPanel
          filters={filters}
          priceRange={result.priceRange}
          amenities={result.amenities}
          onChange={updateFilters}
        />
        <Button type="button" onClick={() => setIsPanelOpen(false)} className="sticky bottom-0 mt-4 w-full lg:hidden">
          Show {formatCount(result.total, "stay")}
        </Button>
      </aside>

      <div className="min-w-0">
        <BookingOffers />

        <div className="mt-4 mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold" aria-live="polite">
            {formatCount(result.total, "stay")} found
            {search.destination && ` for "${search.destination}"`}
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
            <HotelSortSelect value={filters.sort} onChange={(sort) => updateFilters({ sort })} />
          </div>
        </div>

        <div className={`transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}>
          {result.items.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {result.items.map((hotel, index) => (
                <li key={hotel.id}>
                  <HotelCard
                    hotel={hotel}
                    query={toSearchQuery(search)}
                    nights={nights}
                    rooms={search.rooms}
                    isPriority={index === 0}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <StatusMessage
              iconName="search"
              title="No stays found"
              description={
                activeCount > 0
                  ? "Try removing a filter to see more stays."
                  : "Try a different destination or clear your search."
              }
            >
              {clearButton}
            </StatusMessage>
          )}

          <Pagination page={result.page} pageCount={result.pageCount} onChange={goToPage} />
        </div>
      </div>
    </div>
  );
};

export default HotelResultsView;
