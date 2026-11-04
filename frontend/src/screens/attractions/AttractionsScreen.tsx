import { Suspense } from "react";
import {
  AttractionHero,
  AttractionResults,
  AttractionsSkeleton,
  Recommendations,
  TrendingDestinations,
} from "@/components";
import { parseAttractionFilters, toAttractionQuery } from "@/lib";
import { getAttractionsContent, searchAttractions } from "@/services";
import type { RouteParams } from "@/types";

type AttractionsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const AttractionsContent = async ({ searchParams }: AttractionsScreenProps) => {
  const filters = parseAttractionFilters(await searchParams);
  const [content, result] = await Promise.all([getAttractionsContent(), searchAttractions(filters)]);

  return (
    <>
      <AttractionHero hero={content.hero} quickSearches={content.quickSearches} query={filters.query} />

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface px-4 pt-10">
        <TrendingDestinations section={content.trending} />
        <AttractionResults key={toAttractionQuery(filters)} title={content.resultsTitle} filters={filters} result={result} />
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
