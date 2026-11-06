import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Breadcrumb,
  EnquiryForm,
  HotelDetailsSkeleton,
  InclusionLists,
  SectionHeading,
  SectionTabs,
  TourGrid,
  TourHeader,
  TourItinerary,
  TourOptions,
} from "@/components";
import { tourPaths, tourTypeLabels } from "@/constants";
import { formatCount, formatShortDate, parseEnquiryDefaults, toContactDefaults } from "@/lib";
import { getCurrentUser, getMoreTours, getTourBySlug } from "@/services";
import type { RouteParams } from "@/types";

type TourDetailsScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const sections = [
  { id: "itinerary", label: "Itinerary" },
  { id: "included", label: "What's included" },
  { id: "enquire", label: "Enquire" },
];

const TourDetailsContent = async ({ params, searchParams }: TourDetailsScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const moreTours = await getMoreTours(tour);
  const defaults = parseEnquiryDefaults(query);
  const dateOptions =
    tour.type === "group"
      ? tour.departures.map(({ date, seatsLeft }) => ({
          value: date,
          label: `${formatShortDate(date)} (${formatCount(seatsLeft, "seat")} left)`,
        }))
      : undefined;

  return (
    <>
      <Breadcrumb
        links={[
          { label: "Home", href: "/" },
          { label: tourTypeLabels[tour.type], href: tourPaths[tour.type] },
        ]}
        current={tour.name}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="min-w-0">
          <TourHeader tour={tour} />
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <TourOptions tour={tour} />
        </div>

        <div className="min-w-0 rounded-card bg-surface p-6">
          <SectionTabs sections={sections} className="" />
          <TourItinerary days={tour.itinerary} />
          <InclusionLists included={tour.included} notIncluded={tour.notIncluded} />

          <section id="enquire" className="mt-8 scroll-mt-32">
            <h2 className="type-section font-bold">Enquire about this tour</h2>
            <p className="mt-1 mb-4 text-sm text-ink-soft">Tours are not booked instantly. Send your details and we will confirm with you.</p>
            <EnquiryForm
              key={`${defaults.date}-${defaults.travelers}`}
              subject={{ type: "tour", slug: tour.slug }}
              dateOptions={dateOptions}
              contact={toContactDefaults(await getCurrentUser())}
              defaults={defaults}
            />
          </section>
        </div>
      </div>

      <section className="mt-12">
        <SectionHeading>More {tourTypeLabels[tour.type].toLowerCase()}</SectionHeading>
        <TourGrid tours={moreTours} />
      </section>
    </>
  );
};

const TourDetailsScreen = ({ params, searchParams }: TourDetailsScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<HotelDetailsSkeleton />}>
          <TourDetailsContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default TourDetailsScreen;
