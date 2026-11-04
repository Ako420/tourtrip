import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { defaultTrainFilters, toTrainQuery } from "@/lib";
import type { TrainFilters, TrainSearch } from "@/types";

const useTrainFilters = (search: TrainSearch, filters: TrainFilters) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (nextSearch: TrainSearch, next: TrainFilters, scroll: boolean) => {
    startTransition(() => {
      router.push(`/trains/results?${toTrainQuery(nextSearch, next)}`, { scroll });
    });
  };

  return {
    isPending,
    updateFilters: (changes: Partial<TrainFilters>) => navigate(search, { ...filters, ...changes, page: 1 }, false),
    goToPage: (page: number) => navigate(search, { ...filters, page }, true),
    clearFilters: () => navigate(search, { ...defaultTrainFilters, sort: filters.sort }, false),
    changeDates: (dates: Pick<TrainSearch, "departDate" | "returnDate">) => {
      navigate({ ...search, ...dates }, { ...filters, page: 1 }, false);
    },
  };
};

export default useTrainFilters;
