import { hotelSortOptions } from "@/constants";
import type { HotelSort } from "@/types";

type HotelSortSelectProps = {
  value: HotelSort;
  onChange: (value: HotelSort) => void;
};

const HotelSortSelect = ({ value, onChange }: HotelSortSelectProps) => {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap sm:text-muted">Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as HotelSort)}
        className="h-10 rounded-md border border-line bg-surface px-2 font-medium outline-none focus:border-primary"
      >
        {hotelSortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default HotelSortSelect;
