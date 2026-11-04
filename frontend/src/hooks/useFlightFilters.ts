import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { defaultFlightFilters, toFlightResultsQuery } from "@/lib";
import type { FlightFilters, FlightSearch } from "@/types";

const useFlightFilters = (search: FlightSearch, filters: FlightFilters) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (nextSearch: FlightSearch, next: FlightFilters, scroll: boolean) => {
    startTransition(() => {
      router.push(`/flights/results?${toFlightResultsQuery(nextSearch, next)}`, { scroll });
    });
  };

  return {
    isPending,
    updateFilters: (changes: Partial<FlightFilters>) => navigate(search, { ...filters, ...changes, page: 1 }, false),
    goToPage: (page: number) => navigate(search, { ...filters, page }, true),
    clearFilters: () => navigate(search, { ...defaultFlightFilters, sort: filters.sort }, false),
    changeDates: (dates: Pick<FlightSearch, "departDate" | "returnDate">) => {
      navigate({ ...search, ...dates }, { ...filters, page: 1 }, false);
    },
  };
};

export default useFlightFilters;
