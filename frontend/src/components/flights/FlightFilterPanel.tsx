"use client";

import { useState } from "react";
import { departureWindows, stopFilters } from "@/constants";
import { formatPrice } from "@/lib";
import type { FlightFilters, FlightSearchResult } from "@/types";
import FilterCheckbox from "../ui/FilterCheckbox";
import FilterGroup from "../ui/FilterGroup";

type FlightFilterPanelProps = {
  filters: FlightFilters;
  result: FlightSearchResult;
  onChange: (changes: Partial<FlightFilters>) => void;
};

const toggle = <T,>(list: T[], value: T) => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const FlightFilterPanel = ({ filters, result, onChange }: FlightFilterPanelProps) => {
  const { priceRange, currency } = result;
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? priceRange.max);

  const commitPrice = () => {
    const next = maxPrice < priceRange.max ? maxPrice : undefined;

    if (next !== filters.maxPrice) onChange({ maxPrice: next });
  };

  return (
    <div>
      <FilterGroup title="Stops">
        {stopFilters.map((stop) => (
          <FilterCheckbox
            key={stop.value}
            checked={filters.stops.includes(stop.value)}
            onChange={() => onChange({ stops: toggle(filters.stops, stop.value) })}
          >
            {stop.label}
          </FilterCheckbox>
        ))}
      </FilterGroup>

      {priceRange.max > priceRange.min && (
        <FilterGroup title="Max price">
          <p className="mb-2 text-sm text-ink-soft">Up to {formatPrice(maxPrice, currency)}</p>
          <input
            type="range"
            aria-label="Maximum price"
            min={priceRange.min}
            max={priceRange.max}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            onPointerUp={commitPrice}
            onKeyUp={commitPrice}
            className="w-full accent-primary"
          />
        </FilterGroup>
      )}

      <FilterGroup title="Departure time">
        {departureWindows.map((window) => (
          <FilterCheckbox
            key={window.id}
            checked={filters.departureWindows.includes(window.id)}
            onChange={() => onChange({ departureWindows: toggle(filters.departureWindows, window.id) })}
          >
            {window.label} <span className="text-xs text-muted">{window.detail}</span>
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Airlines">
        {result.airlines.map((airline) => (
          <FilterCheckbox
            key={airline.name}
            checked={filters.airlines.includes(airline.name)}
            onChange={() => onChange({ airlines: toggle(filters.airlines, airline.name) })}
          >
            <span className="flex w-full justify-between gap-2">
              {airline.name}
              <span className="text-xs text-muted">{formatPrice(airline.lowestPrice, currency)}</span>
            </span>
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Fare options">
        <FilterCheckbox checked={filters.checkedBag} onChange={() => onChange({ checkedBag: !filters.checkedBag })}>
          Checked bag included
        </FilterCheckbox>
        <FilterCheckbox checked={filters.refundable} onChange={() => onChange({ refundable: !filters.refundable })}>
          Refundable
        </FilterCheckbox>
      </FilterGroup>
    </div>
  );
};

export default FlightFilterPanel;
