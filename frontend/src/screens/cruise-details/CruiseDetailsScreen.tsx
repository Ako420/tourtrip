import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Breadcrumb,
  CruiseGrid,
  CruiseRoute,
  CruiseSailings,
  EnquiryForm,
  HotelDetailsSkeleton,
  InclusionLists,
  SectionHeading,
  TripHeader,
} from "@/components";
import { cruisesPath } from "@/constants";
import { formatCount, formatShortDate, toContactDefaults } from "@/lib";
import { getCruiseBySlug, getCurrentUser, getMoreCruises } from "@/services";

type CruiseDetailsScreenProps = {
  params: Promise<{ slug: string }>;
};

const CruiseDetailsContent = async ({ params }: CruiseDetailsScreenProps) => {
  const { slug } = await params;
  const cruise = await getCruiseBySlug(slug);

  if (!cruise) {
    notFound();
  }

  const moreCruises = await getMoreCruises(cruise);

  return (
    <>
      <Breadcrumb
        links={[
          { label: "Home", href: "/" },
          { label: "Cruises", href: cruisesPath },
        ]}
        current={cruise.name}
      />
      <TripHeader
        name={cruise.name}
        imageUrl={cruise.imageUrl}
        summary={cruise.summary}
        facts={[
          { iconName: "ship", label: cruise.line },
          { iconName: "location", label: cruise.destination },
          { iconName: "clock", label: formatCount(cruise.nights, "night") },
        ]}
        rating={cruise.rating}
        reviewCount={cruise.reviewCount}
        price={cruise.price}
        currency={cruise.currency}
      />
      <CruiseRoute route={cruise.route} />
      <InclusionLists included={cruise.included} notIncluded={cruise.notIncluded} />
      <CruiseSailings cruise={cruise} />

      <section id="enquire" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-bold">Enquire about this cruise</h2>
        <p className="mt-1 mb-4 text-sm text-muted">Cruises are not booked instantly. Send your details and we will confirm with you.</p>
        <EnquiryForm
          subject={{ type: "cruise", slug: cruise.slug }}
          dateOptions={cruise.sailings.map(({ date }) => ({ value: date, label: formatShortDate(date) }))}
          contact={toContactDefaults(await getCurrentUser())}
        />
      </section>

      <section className="mt-12">
        <SectionHeading>More cruises</SectionHeading>
        <CruiseGrid cruises={moreCruises} />
      </section>
    </>
  );
};

const CruiseDetailsScreen = ({ params }: CruiseDetailsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <CruiseDetailsContent params={params} />
      </Suspense>
    </div>
  );
};

export default CruiseDetailsScreen;
