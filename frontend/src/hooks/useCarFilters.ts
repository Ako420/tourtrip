import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toCarQuery } from "@/lib";
import type { CarFilters, CarSearch } from "@/types";

const useCarFilters = (search: CarSearch, filters: CarFilters) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: CarFilters, scroll: boolean) => {
    startTransition(() => {
      router.push(`/cars/results?${toCarQuery(search, next)}`, { scroll });
    });
  };

  return {
    isPending,
    updateFilters: (changes: Partial<CarFilters>) => navigate({ ...filters, ...changes, page: 1 }, false),
    goToPage: (page: number) => navigate({ ...filters, page }, true),
    clearFilters: () => {
      navigate(
        { categories: [], transmissions: [], suppliers: [], freeCancellation: false, sort: filters.sort, page: 1 },
        false,
      );
    },
  };
};

export default useCarFilters;
