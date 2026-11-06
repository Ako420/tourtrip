import { hotelSortOptions } from "@/constants";
import type { HotelSort } from "@/types";
import Icon from "../ui/Icon";

type HotelSortSelectProps = {
  value: HotelSort;
  onChange: (value: HotelSort) => void;
};

const HotelSortSelect = ({ value, onChange }: HotelSortSelectProps) => {
  return (
    <label className="flex h-9 items-center gap-2 rounded-md border border-line px-3 text-sm focus-within:border-primary">
      <Icon name="swap" className="rotate-90 text-xs" />
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as HotelSort)}
        className="bg-surface outline-none"
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
