import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { defaultHotelFilters, toHotelQuery } from "@/lib";
import type { HotelFilters, HotelSearch } from "@/types";

// Filters live in the URL, so results can be shared and the back button works.
const useHotelFilters = (search: HotelSearch, filters: HotelFilters) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: HotelFilters, scroll: boolean) => {
    startTransition(() => {
      router.push(`/hotels/list?${toHotelQuery(search, next)}`, { scroll });
    });
  };

  return {
    isPending,
    updateFilters: (changes: Partial<HotelFilters>) => navigate({ ...filters, ...changes, page: 1 }, false),
    goToPage: (page: number) => navigate({ ...filters, page }, true),
    clearFilters: () => navigate({ ...defaultHotelFilters, sort: filters.sort }, false),
  };
};

export default useHotelFilters;
