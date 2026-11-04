import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toAttractionQuery } from "@/lib";
import type { AttractionFilters } from "@/types";

const useAttractionFilters = (filters: AttractionFilters) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: AttractionFilters) => {
    startTransition(() => {
      router.push(`/attractions?${toAttractionQuery(next)}#results`, { scroll: false });
    });
  };

  return {
    isPending,
    updateFilters: (changes: Partial<AttractionFilters>) => navigate({ ...filters, ...changes, page: 1 }),
    goToPage: (page: number) => navigate({ ...filters, page }),
  };
};

export default useAttractionFilters;
