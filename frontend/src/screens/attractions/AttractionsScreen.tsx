import { Suspense } from "react";
import {
  AttractionHero,
  AttractionRecommended,
  AttractionResults,
  AttractionsSkeleton,
  BannerCarousel,
  BenefitColumns,
  HotelOfferBanner,
  Recommendations,
  TrendingDestinations,
} from "@/components";
import { parseAttractionFilters, toAttractionQuery } from "@/lib";
import { getAttractionsContent, searchAttractions } from "@/services";
import type { AttractionFilters, AttractionsContent, RouteParams } from "@/types";

type AttractionsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const AttractionList = async ({ content, filters }: { content: AttractionsContent; filters: AttractionFilters }) => {
  const query = toAttractionQuery(filters);

  if (query) {
    const result = await searchAttractions(filters);

    return <AttractionResults key={query} title={content.resultsTitle} filters={filters} result={result} />;
  }

  const rows = await Promise.all(
    content.recommended.items.map(async (row) => {
      const { items } = await searchAttractions({ ...filters, category: row.category });

      return { ...row, attractions: items };
    }),
  );

  return <AttractionRecommended title={content.recommended.title} rows={rows} />;
};

const AttractionsContent = async ({ searchParams }: AttractionsScreenProps) => {
  const filters = parseAttractionFilters(await searchParams);
  const content = await getAttractionsContent();

  return (
    <>
      <AttractionHero hero={content.hero} quickSearches={content.quickSearches} query={filters.query} />

      <div className="page-sheet bg-surface! px-4 pt-8">
        <TrendingDestinations section={content.trending} />
        <div className="mt-12">
          <HotelOfferBanner offer={content.offer} />
        </div>
        <BannerCarousel section={{ items: content.banners }} />
        <AttractionList content={content} filters={filters} />
        <BenefitColumns items={content.benefits} large />
        <Recommendations section={content.recommendations} />
      </div>
    </>
  );
};

const AttractionsScreen = ({ searchParams }: AttractionsScreenProps) => {
  return (
    <Suspense fallback={<AttractionsSkeleton />}>
      <AttractionsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default AttractionsScreen;
