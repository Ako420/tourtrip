import Link from "next/link";
import { toGuideHref } from "@/lib";

type GuideCityFilterProps = {
  cities: string[];
  activeCity?: string;
};

const GuideCityFilter = ({ cities, activeCity }: GuideCityFilterProps) => {
  const options = [{ label: "All", city: undefined }, ...cities.map((city) => ({ label: city, city }))];

  return (
    <nav aria-label="Filter guides by city" className="scrollbar-none flex gap-2 overflow-x-auto">
      {options.map((option) => (
        <Link
          key={option.label}
          href={toGuideHref({ city: option.city, page: 1 })}
          scroll={false}
          aria-current={option.city === activeCity ? "true" : undefined}
          className={`shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
            option.city === activeCity ? "border-ink bg-ink text-white" : "border-line hover:border-primary hover:text-primary"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </nav>
  );
};

export default GuideCityFilter;
