import { toGuideHref } from "@/lib";
import LinkTabs from "../ui/LinkTabs";

type GuideCityFilterProps = {
  cities: string[];
  activeCity?: string;
};

const GuideCityFilter = ({ cities, activeCity }: GuideCityFilterProps) => {
  const options = [{ label: "All", city: undefined }, ...cities.map((city) => ({ label: city, city }))];

  return (
    <LinkTabs
      label="Filter guides by city"
      tabs={options.map(({ label, city }) => ({
        label,
        href: toGuideHref({ city, page: 1 }),
        isActive: city === activeCity,
      }))}
    />
  );
};

export default GuideCityFilter;
