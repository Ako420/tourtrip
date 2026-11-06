import { flightSortOptions } from "@/constants";
import type { FlightSearchResult, FlightSort } from "@/types";
import Price from "../ui/Price";

type FlightSortTabsProps = {
  value: FlightSort;
  summary: FlightSearchResult["sortSummary"];
  currency: string;
  onChange: (value: FlightSort) => void;
};

const FlightSortTabs = ({ value, summary, currency, onChange }: FlightSortTabsProps) => {
  return (
    <div role="tablist" aria-label="Sort flights" className="grid grid-cols-2 bg-surface sm:grid-cols-4">
      {flightSortOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={`border-b-2 px-3 py-2 text-center transition-colors duration-300 ease-out ${
            option.value === value ? "border-primary" : "border-transparent hover:text-primary"
          }`}
        >
          <span className="block text-sm font-bold">{option.label}</span>
          <span className="block h-5 text-sm text-ink-soft">
            {option.value === "fastest" ? summary.fastest : summary[option.value] !== undefined && <Price amount={summary[option.value] as number} currency={currency} />}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FlightSortTabs;
