import { carCategories, carTransmissions } from "@/constants";
import type { CarFilters } from "@/types";
import FilterCheckbox from "../ui/FilterCheckbox";
import FilterGroup from "../ui/FilterGroup";

type CarFilterPanelProps = {
  filters: CarFilters;
  suppliers: string[];
  onChange: (changes: Partial<CarFilters>) => void;
};

const toggle = (list: string[], value: string) => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const CarFilterPanel = ({ filters, suppliers, onChange }: CarFilterPanelProps) => {
  return (
    <div>
      <FilterGroup title="Car type">
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

      <FilterGroup title="Transmission">
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

      <FilterGroup title="Supplier">
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

      <FilterGroup title="Rental options">
        <FilterCheckbox
          checked={filters.freeCancellation}
          onChange={() => onChange({ freeCancellation: !filters.freeCancellation })}
        >
          Free cancellation
        </FilterCheckbox>
      </FilterGroup>
    </div>
  );
};

export default CarFilterPanel;
