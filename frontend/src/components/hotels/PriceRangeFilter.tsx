"use client";

import { useState } from "react";
import { priceBrackets } from "@/constants";
import { formatPrice } from "@/lib";

type PriceChange = {
  minPrice?: number;
  maxPrice?: number;
};

type PriceRangeFilterProps = {
  limit: { min: number; max: number };
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  onChange: (change: PriceChange) => void;
};

const STEP = 5;

const PriceRangeFilter = ({ limit, minPrice, maxPrice, currency = "USD", onChange }: PriceRangeFilterProps) => {
  const [low, setLow] = useState(minPrice ?? limit.min);
  const [high, setHigh] = useState(maxPrice ?? limit.max);
  const span = Math.max(limit.max - limit.min, 1);

  const commit = () => {
    const nextMin = low > limit.min ? low : undefined;
    const nextMax = high < limit.max ? high : undefined;

    if (nextMin !== minPrice || nextMax !== maxPrice) {
      onChange({ minPrice: nextMin, maxPrice: nextMax });
    }
  };

  const sliderProps = {
    type: "range",
    min: limit.min,
    max: limit.max,
    step: STEP,
    onPointerUp: commit,
    onKeyUp: commit,
    className: "range-thumb absolute inset-x-0 top-0 h-5 w-full",
  };

  return (
    <div>
      <p className="mb-3 text-sm text-ink-soft">
        {formatPrice(low, currency)} - {formatPrice(high, currency)} per night
      </p>

      <div className="relative h-5">
        <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-line" />
        <div
          className="absolute top-2 h-1 rounded-full bg-primary"
          style={{
            left: `${((low - limit.min) / span) * 100}%`,
            right: `${((limit.max - high) / span) * 100}%`,
          }}
        />
        <input
          {...sliderProps}
          aria-label="Minimum price"
          value={low}
          onChange={(event) => setLow(Math.min(Number(event.target.value), high - STEP))}
        />
        <input
          {...sliderProps}
          aria-label="Maximum price"
          value={high}
          onChange={(event) => setHigh(Math.max(Number(event.target.value), low + STEP))}
        />
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {priceBrackets.map((bracket) => {
          const isActive = minPrice === bracket.minPrice && maxPrice === bracket.maxPrice;

          return (
            <li key={bracket.label}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  onChange(isActive ? {} : { minPrice: bracket.minPrice, maxPrice: bracket.maxPrice })
                }
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-300 ease-out ${
                  isActive ? "bg-primary text-white" : "bg-surface-alt text-ink-soft hover:text-primary"
                }`}
              >
                {bracket.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PriceRangeFilter;
