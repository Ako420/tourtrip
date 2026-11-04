import { flightSortOptions } from "@/constants";
import type { FlightSearchResult, FlightSort } from "@/types";

type FlightSortTabsProps = {
  value: FlightSort;
  summary: FlightSearchResult["sortSummary"];
  onChange: (value: FlightSort) => void;
};

const FlightSortTabs = ({ value, summary, onChange }: FlightSortTabsProps) => {
  return (
    <div role="tablist" aria-label="Sort flights" className="grid grid-cols-2 overflow-hidden rounded-card border border-line sm:grid-cols-4">
      {flightSortOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={`border-b-2 px-3 py-2 text-left transition-colors duration-300 ease-out ${
            option.value === value ? "border-primary bg-primary-soft" : "border-transparent hover:bg-surface-alt"
          }`}
        >
          <span className="block text-sm font-semibold">{option.label}</span>
          <span className="block h-4 text-xs text-muted">{summary[option.value]}</span>
        </button>
      ))}
    </div>
  );
};

export default FlightSortTabs;
