"use client";

import { useState } from "react";
import { carSortOptions } from "@/constants";
import { useCarFilters } from "@/hooks";
import { countCarFilters, formatCount, toCarQuery } from "@/lib";
import type { CarFilters, CarSearch, CarSearchResult, CarSort } from "@/types";
import BookingOffers from "../hotels/BookingOffers";
import AppImage from "../ui/AppImage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import Pagination from "../ui/Pagination";
import Price from "../ui/Price";
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

  const toggleCategory = (id: string) => {
    const isActive = filters.categories.includes(id);

    updateFilters({ categories: isActive ? filters.categories.filter((item) => item !== id) : [...filters.categories, id] });
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[17.3rem_minmax(0,1fr)]">
      <aside
        aria-label="Filters"
        className={`fixed inset-0 z-50 overflow-y-auto bg-surface p-4 lg:static lg:z-auto lg:block lg:self-start lg:overflow-visible lg:rounded-card ${
          isPanelOpen ? "block" : "hidden"
        }`}
      >
        {clearButton && <div className="mb-2 flex justify-end">{clearButton}</div>}
        <h2 className="mb-4 font-bold lg:hidden">Filters</h2>
        <CarFilterPanel filters={filters} suppliers={result.suppliers} onChange={updateFilters} />
        <Button type="button" onClick={() => setIsPanelOpen(false)} className="sticky bottom-0 mt-4 w-full lg:hidden">
          Show {formatCount(result.total, "car")}
        </Button>
      </aside>

      <div className="min-w-0">
        <BookingOffers />

        <div className="mt-3 mb-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold" aria-live="polite">
            {formatCount(result.total, "car")} in {search.location}
            <span className="ml-2 text-sm font-normal text-ink-soft">{formatCount(result.days, "day")}</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPanelOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md bg-surface px-3 text-sm font-medium lg:hidden"
            >
              <Icon name="filter" />
              Filters{activeCount > 0 && ` (${activeCount})`}
            </button>
            <label className="flex h-9 items-center gap-2 rounded-md bg-surface px-3 text-sm">
              <Icon name="swap" className="rotate-90 text-xs" />
              <span className="sr-only">Sort by</span>
              <select
                value={filters.sort}
                onChange={(event) => updateFilters({ sort: event.target.value as CarSort })}
                className="bg-surface font-medium outline-none"
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

        <ul aria-label="Car types" className="scrollbar-none mb-4 flex divide-x divide-line overflow-x-auto rounded-card bg-surface py-3">
          {result.categories.map((category) => {
            const isActive = filters.categories.includes(category.id);

            return (
              <li key={category.id} className="min-w-28 flex-1 px-2">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full rounded-md p-1 text-center transition-colors duration-300 ease-out hover:text-primary ${
                    isActive ? "bg-primary-soft" : ""
                  }`}
                >
                  <span className="block text-sm font-bold">{category.label}</span>
                  <span className="block text-xs text-ink-soft">
                    From <Price amount={category.fromPrice} currency={category.currency} />
                  </span>
                  <span className="relative mt-1 block h-12 overflow-hidden rounded-sm bg-surface-alt">
                    <AppImage src={category.imageUrl} alt="" fill sizes="7rem" className="object-cover" />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

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
