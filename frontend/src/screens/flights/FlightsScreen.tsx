import { Suspense } from "react";
import {
  AppPromo,
  BannerCarousel,
  FlightDeals,
  FlightHero,
  FlightsSkeleton,
  FlightTips,
  Recommendations,
  TrendingSection,
  TrustSection,
  WhyBook,
} from "@/components";
import { parseFlightSearch, toFlightQuery } from "@/lib";
import { getAirports, getFlightDeals, getFlightsContent } from "@/services";
import type { FlightSearch, RouteParams } from "@/types";

type FlightsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const getDealsTitle = ({ from, to }: FlightSearch, fallback: string) => {
  if (from && to) return `Flights from ${from} to ${to}`;
  if (to) return `Flights to ${to}`;
  if (from) return `Flights from ${from}`;

  return fallback;
};

const FlightsContent = async ({ searchParams }: FlightsScreenProps) => {
  const search = parseFlightSearch(await searchParams);
  const [content, deals, airports] = await Promise.all([
    getFlightsContent(),
    getFlightDeals(search),
    getAirports(),
  ]);
  const query = toFlightQuery(search);

  return (
    <>
      <FlightHero key={query} hero={content.hero} quickLinks={content.quickLinks} search={search} airports={airports} />

      <div className="relative -mt-6 rounded-t-[2rem] bg-surface pt-10">
        <div className="px-4">
          <TrustSection section={content.trust} />
          <TrendingSection section={content.trending} />
          <FlightDeals key={query} title={getDealsTitle(search, content.dealsTitle)} deals={deals} />
        </div>

        <AppPromo app={content.app} />

        <div className="px-4">
          <BannerCarousel section={content.banners} />
          <WhyBook section={content.why} />
          <FlightTips section={content.tips} />
          <Recommendations section={content.recommendations} />
        </div>
      </div>
    </>
  );
};

const FlightsScreen = ({ searchParams }: FlightsScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <FlightsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default FlightsScreen;
