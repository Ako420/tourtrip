import { carCategories, carTransmissions } from "@/constants";
import type { CarFilters } from "@/types";
import FilterCheckbox from "../ui/FilterCheckbox";
import FilterGroup from "../ui/FilterGroup";

type CarFilterPanelProps = {
  filters: CarFilters;
  suppliers: string[];
  onChange: (changes: Partial<CarFilters>) => void;
};

const POPULAR_TRANSMISSION = carTransmissions[0];

const toggle = (list: string[], value: string) => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const CarFilterPanel = ({ filters, suppliers, onChange }: CarFilterPanelProps) => {
  return (
    <div>
      <FilterGroup title="Popular filters" small>
        <FilterCheckbox
          checked={filters.transmissions.includes(POPULAR_TRANSMISSION)}
          onChange={() => onChange({ transmissions: toggle(filters.transmissions, POPULAR_TRANSMISSION) })}
        >
          {POPULAR_TRANSMISSION}
        </FilterCheckbox>
        <FilterCheckbox
          checked={filters.freeCancellation}
          onChange={() => onChange({ freeCancellation: !filters.freeCancellation })}
        >
          Free cancellation
        </FilterCheckbox>
      </FilterGroup>

      <FilterGroup title="Transmission" small>
        {carTransmissions.map((transmission) => (
          <FilterCheckbox
            key={transmission}
            checked={filters.transmissions.includes(transmission)}
            onChange={() => onChange({ transmissions: toggle(filters.transmissions, transmission) })}
          >
            {transmission}
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Car type" small>
        {carCategories.map((category) => (
          <FilterCheckbox
            key={category.id}
            checked={filters.categories.includes(category.id)}
            onChange={() => onChange({ categories: toggle(filters.categories, category.id) })}
          >
            {category.label}
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Car rental supplier" small>
        {suppliers.map((supplier) => (
          <FilterCheckbox
            key={supplier}
            checked={filters.suppliers.includes(supplier)}
            onChange={() => onChange({ suppliers: toggle(filters.suppliers, supplier) })}
          >
            {supplier}
          </FilterCheckbox>
        ))}
      </FilterGroup>
    </div>
  );
};

export default CarFilterPanel;
