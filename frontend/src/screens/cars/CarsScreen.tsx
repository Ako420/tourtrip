import { Suspense } from "react";
import {
  CarBenefits,
  CarCities,
  CarGuide,
  CarHero,
  CarReviews,
  CarSearchForm,
  CarSuppliers,
  CarTypes,
  FlightsSkeleton,
  FlightTips,
  HotelOfferBanner,
  Recommendations,
  SectionNav,
  StickyBar,
} from "@/components";
import { parseCarFilters, parseCarSearch } from "@/lib";
import { getCarLocations, getCarsContent } from "@/services";
import type { CarCategory, RouteParams } from "@/types";

type CarsScreenProps = {
  searchParams: Promise<RouteParams>;
};

const anchorClass = "scroll-mt-44";

const CarsContent = async ({ searchParams }: CarsScreenProps) => {
  const params = await searchParams;
  const search = parseCarSearch(params);
  const [content, locations] = await Promise.all([getCarsContent(), getCarLocations()]);
  const preselectedType = parseCarFilters(params).categories[0] as CarCategory | undefined;
  const formKey = `${search.location}-${preselectedType}`;

  return (
    <>
      <CarHero
        key={formKey}
        hero={content.hero}
        search={search}
        locations={locations}
        preselectedType={preselectedType}
      />

      <StickyBar dense>
        <CarSearchForm key={formKey} initialValues={search} locations={locations} preselectedType={preselectedType} compact />
        <div className="mt-3">
          <SectionNav label="Page sections" links={content.sectionLinks} align="start" />
        </div>
      </StickyBar>

      <div className="page-sheet bg-surface! px-4 pt-16">
        <HotelOfferBanner offer={content.offer} />
        <CarBenefits items={content.benefits} />
        <CarTypes section={content.types} />
        <div id="cities" className={anchorClass}>
          <CarCities section={content.cities} />
        </div>
        <div id="reviews" className={anchorClass}>
          <CarReviews section={content.reviews} />
        </div>
        <div id="suppliers" className={anchorClass}>
          <CarSuppliers section={content.suppliers} />
        </div>
        <div id="faqs" className={anchorClass}>
          <FlightTips section={content.faqs} />
        </div>
        <div id="guide" className={anchorClass}>
          <CarGuide section={content.guide} />
        </div>
        <Recommendations section={content.recommendations} />
      </div>
    </>
  );
};

const CarsScreen = ({ searchParams }: CarsScreenProps) => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <CarsContent searchParams={searchParams} />
    </Suspense>
  );
};

export default CarsScreen;
