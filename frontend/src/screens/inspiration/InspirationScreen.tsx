import { Suspense } from "react";
import {
  Breadcrumb,
  GuideCityFilter,
  GuideFeatured,
  GuideGrid,
  GuidePagination,
  GuideSectionLinks,
  Skeleton,
} from "@/components";
import { FEATURED_GUIDE_CITIES, RECENT_GUIDE_COUNT } from "@/constants";
import { parseGuideFilters } from "@/lib";
import { getGuides, getGuidesByCity } from "@/services";
import type { RouteParams } from "@/types";

type InspirationScreenProps = {
  searchParams: Promise<RouteParams>;
};

const headingClass = "mb-5 scroll-mt-24 text-2xl font-semibold";

const GuideHighlights = async () => {
  const [featured, { items }] = await Promise.all([getGuidesByCity(FEATURED_GUIDE_CITIES), getGuides({ page: 1 })]);

  return (
    <>
      <GuideFeatured guides={featured} />
      <GuideSectionLinks />

      <section className="mt-8">
        <h2 id="recent" className={headingClass}>Most recent articles</h2>
        <GuideGrid guides={items.slice(0, RECENT_GUIDE_COUNT)} />
      </section>
    </>
  );
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
      <Breadcrumb links={[{ label: "Hotel Jr", href: "/" }]} current="Travel Inspiration" />
      <h1 className="mt-5 text-4xl">Travel Inspiration &amp; Tips</h1>

      <Suspense fallback={<Skeleton className="mt-8 h-96" />}>
        <GuideHighlights />
      </Suspense>

      <section className="mt-10">
        <h2 id="all" className={headingClass}>All articles</h2>
        <Suspense fallback={<Skeleton className="h-96" />}>
          <GuideResults searchParams={searchParams} />
        </Suspense>
      </section>
    </div>
  );
};

export default InspirationScreen;
