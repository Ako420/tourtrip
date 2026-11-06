import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Breadcrumb,
  ButtonLink,
  CruiseGrid,
  CruiseHeader,
  CruiseRoute,
  EnquiryForm,
  HotelDetailsSkeleton,
  InclusionLists,
  Price,
  SectionHeading,
  SectionTabs,
} from "@/components";
import { cruisesPath } from "@/constants";
import { formatShortDate, parseEnquiryDefaults, toContactDefaults } from "@/lib";
import { getCruiseBySlug, getCurrentUser, getMoreCruises } from "@/services";
import type { RouteParams } from "@/types";

type CruiseDetailsScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const sections = [
  { id: "highlights", label: "Highlights" },
  { id: "itinerary", label: "Itinerary" },
  { id: "included", label: "What's included" },
  { id: "enquire", label: "Enquire" },
];

const CruiseDetailsContent = async ({ params, searchParams }: CruiseDetailsScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const cruise = await getCruiseBySlug(slug);

  if (!cruise) {
    notFound();
  }

  const moreCruises = await getMoreCruises(cruise);
  const defaults = parseEnquiryDefaults(query);

  return (
    <>
      <Breadcrumb
        links={[
          { label: "Home", href: "/" },
          { label: "Cruises", href: cruisesPath },
        ]}
        current={cruise.name}
      />
      <CruiseHeader cruise={cruise} />
      <SectionTabs
        sections={sections}
        className="mt-4 rounded-card px-5"
        action={
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <span className="text-sm text-ink-soft">
              From{" "}
              <span className="text-2xl font-bold text-primary">
                <Price amount={cruise.price} currency={cruise.currency} />
              </span>
            </span>
            <ButtonLink href="#enquire" size="sm">
              Enquire now
            </ButtonLink>
          </div>
        }
      />

      <div className="mt-4 rounded-card bg-surface p-6">
        <section id="highlights" className="scroll-mt-32">
          <h2 className="text-center text-2xl font-bold">Highlights</h2>
          <p className="mt-3 text-center text-sm text-ink-soft">{cruise.summary}</p>
        </section>
        <CruiseRoute route={cruise.route} />
        <InclusionLists included={cruise.included} notIncluded={cruise.notIncluded} titleClassName="text-center text-2xl" />

        <section id="enquire" className="mt-8 scroll-mt-32">
          <h2 className="text-center text-2xl font-bold">Enquire about this cruise</h2>
          <p className="mt-1 mb-4 text-center text-sm text-ink-soft">
            Cruises are not booked instantly. Send your details and we will confirm with you.
          </p>
          <EnquiryForm
            key={defaults.date}
            subject={{ type: "cruise", slug: cruise.slug }}
            dateOptions={cruise.sailings.map(({ date }) => ({ value: date, label: formatShortDate(date) }))}
            contact={toContactDefaults(await getCurrentUser())}
            defaults={defaults}
          />
        </section>
      </div>

      <section className="mt-12">
        <SectionHeading>More cruises</SectionHeading>
        <CruiseGrid cruises={moreCruises} />
      </section>
    </>
  );
};

const CruiseDetailsScreen = ({ params, searchParams }: CruiseDetailsScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<HotelDetailsSkeleton />}>
          <CruiseDetailsContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default CruiseDetailsScreen;
