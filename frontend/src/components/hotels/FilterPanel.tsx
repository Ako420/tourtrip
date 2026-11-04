import { ratingFilters, starFilters } from "@/constants";
import type { Amenity, HotelFilters, HotelSearchResult } from "@/types";
import FilterCheckbox from "../ui/FilterCheckbox";
import FilterGroup from "../ui/FilterGroup";
import Icon from "../ui/Icon";
import PriceRangeFilter from "./PriceRangeFilter";

type FilterPanelProps = {
  filters: HotelFilters;
  priceRange: HotelSearchResult["priceRange"];
  amenities: Amenity[];
  onChange: (changes: Partial<HotelFilters>) => void;
};

const toggle = <T,>(list: T[], value: T) => {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
};

const FilterPanel = ({ filters, priceRange, amenities, onChange }: FilterPanelProps) => {
  return (
    <div>
      <FilterGroup title="Popular filters">
        <FilterCheckbox
          checked={filters.freeCancellation}
          onChange={() => onChange({ freeCancellation: !filters.freeCancellation })}
        >
          Free cancellation
        </FilterCheckbox>
        <FilterCheckbox checked={filters.breakfast} onChange={() => onChange({ breakfast: !filters.breakfast })}>
          Breakfast included
        </FilterCheckbox>
      </FilterGroup>

      {priceRange.max > priceRange.min && (
        <FilterGroup title="Budget">
          <PriceRangeFilter
            key={`${priceRange.min}-${priceRange.max}-${filters.minPrice}-${filters.maxPrice}`}
            limit={priceRange}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onChange={(change) => onChange({ minPrice: change.minPrice, maxPrice: change.maxPrice })}
          />
        </FilterGroup>
      )}

      <FilterGroup title="Guest rating">
        {ratingFilters.map((rating) => (
          <FilterCheckbox
            key={rating.value}
            checked={filters.minRating === rating.value}
            onChange={() => onChange({ minRating: filters.minRating === rating.value ? undefined : rating.value })}
          >
            {rating.label}
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Star rating">
        {starFilters.map((stars) => (
          <FilterCheckbox
            key={stars}
            checked={filters.stars.includes(stars)}
            onChange={() => onChange({ stars: toggle(filters.stars, stars) })}
          >
            <span className="inline-flex gap-0.5 text-xs text-star" role="img" aria-label={`${stars} stars`}>
              {Array.from({ length: stars }, (_, index) => (
                <Icon key={index} name="star" />
              ))}
            </span>
          </FilterCheckbox>
        ))}
      </FilterGroup>

      <FilterGroup title="Amenities">
        {amenities.map((amenity) => (
          <FilterCheckbox
            key={amenity.id}
            checked={filters.amenities.includes(amenity.id)}
            onChange={() => onChange({ amenities: toggle(filters.amenities, amenity.id) })}
          >
            {amenity.label}
          </FilterCheckbox>
        ))}
      </FilterGroup>
    </div>
  );
};

export default FilterPanel;
