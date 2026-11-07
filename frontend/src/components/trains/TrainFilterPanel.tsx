import { departureWindows, trainChangeFilters } from "@/constants";
import type { TrainFilters, TrainSearchResult } from "@/types";
import FilterCheckbox from "../ui/FilterCheckbox";
import FilterGroup from "../ui/FilterGroup";
import Price from "../ui/Price";

type TrainFilterPanelProps = {
  filters: TrainFilters;
  result: TrainSearchResult;
  onChange: (changes: Partial<TrainFilters>) => void;
};

const toggle = <T,>(list: T[], value: T) => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const TrainFilterPanel = ({ filters, result, onChange }: TrainFilterPanelProps) => {
  return (
    <div>
      <FilterGroup title="Changes" small>
        {trainChangeFilters.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.changes.includes(option.value)}
            onChange={() => onChange({ changes: toggle(filters.changes, option.value) })}
          >
            {option.label}
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Departure time" small>
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

      <FilterGroup title="Operators" small>
        {result.operators.map((operator) => (
          <FilterCheckbox
            key={operator.name}
            checked={filters.operators.includes(operator.name)}
            onChange={() => onChange({ operators: toggle(filters.operators, operator.name) })}
          >
            <span className="flex w-full justify-between gap-2">
              {operator.name}
              <span><Price amount={operator.lowestPrice} currency={result.currency} /></span>
            </span>
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Ticket options" small>
        <FilterCheckbox checked={filters.refundable} onChange={() => onChange({ refundable: !filters.refundable })}>
          Refundable
        </FilterCheckbox>
      </FilterGroup>
    </div>
  );
};

export default TrainFilterPanel;
