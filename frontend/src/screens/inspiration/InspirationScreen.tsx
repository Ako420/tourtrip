import { Suspense } from "react";
import { GuideCityFilter, GuideGrid, GuidePagination, Skeleton } from "@/components";
import { parseGuideFilters } from "@/lib";
import { getGuides } from "@/services";
import type { RouteParams } from "@/types";

type InspirationScreenProps = {
  searchParams: Promise<RouteParams>;
};

const GuideResults = async ({ searchParams }: InspirationScreenProps) => {
  const filters = parseGuideFilters(await searchParams);
  const { items, cities, page, pageCount } = await getGuides(filters);

  return (
    <>
      <GuideCityFilter cities={cities} activeCity={filters.city} />
      <div className="mt-5">
        {items.length > 0 ? (
          <GuideGrid guides={items} />
        ) : (
          <p className="rounded-card border border-line p-5 text-sm text-muted">There is no guide for this city yet.</p>
        )}
      </div>
      <GuidePagination city={filters.city} page={page} pageCount={pageCount} />
    </>
  );
};

const InspirationScreen = ({ searchParams }: InspirationScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <h1 className="type-title font-bold">Travel Inspiration</h1>
      <p className="mt-1 mb-6 text-muted">City guides to help you plan your next trip.</p>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <GuideResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default InspirationScreen;
