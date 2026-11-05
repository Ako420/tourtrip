import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Breadcrumb,
  EnquiryForm,
  HotelDetailsSkeleton,
  SectionHeading,
  TourDepartures,
  TourGrid,
  TourHeader,
  TourInclusions,
  TourItinerary,
} from "@/components";
import { tourPaths, tourTypeLabels } from "@/constants";
import { formatCount, formatShortDate, toContactDefaults } from "@/lib";
import { getCurrentUser, getMoreTours, getTourBySlug } from "@/services";

type TourDetailsScreenProps = {
  params: Promise<{ slug: string }>;
};

const TourDetailsContent = async ({ params }: TourDetailsScreenProps) => {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const moreTours = await getMoreTours(tour);
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
      <TourHeader tour={tour} />
      <TourInclusions included={tour.included} notIncluded={tour.notIncluded} />
      <TourItinerary days={tour.itinerary} />
      <TourDepartures tour={tour} />

      <section id="enquire" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-bold">Enquire about this tour</h2>
        <p className="mt-1 mb-4 text-sm text-muted">Tours are not booked instantly. Send your details and we will confirm with you.</p>
        <EnquiryForm
          subject={{ type: "tour", slug: tour.slug }}
          dateOptions={dateOptions}
          contact={toContactDefaults(await getCurrentUser())}
        />
      </section>

      <section className="mt-12">
        <SectionHeading>More {tourTypeLabels[tour.type].toLowerCase()}</SectionHeading>
        <TourGrid tours={moreTours} />
      </section>
    </>
  );
};

const TourDetailsScreen = ({ params }: TourDetailsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <TourDetailsContent params={params} />
      </Suspense>
    </div>
  );
};

export default TourDetailsScreen;
