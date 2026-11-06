import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AttractionBookCard,
  AttractionHeader,
  AttractionOverview,
  Breadcrumb,
  ButtonLink,
  HotelDetailsSkeleton,
  LocationSection,
  PolicyList,
  Price,
  ReviewsSection,
  SectionTabs,
  SimilarAttractions,
  TicketSelector,
} from "@/components";
import { getAttractionBySlug, getSimilarAttractions } from "@/services";

type AttractionDetailsScreenProps = {
  params: Promise<{ slug: string }>;
};

const sections = [
  { id: "tickets", label: "Tickets and price" },
  { id: "overview", label: "Details" },
  { id: "reviews", label: "Reviews" },
];

const AttractionDetailsContent = async ({ params }: AttractionDetailsScreenProps) => {
  const { slug } = await params;
  const attraction = await getAttractionBySlug(slug);

  if (!attraction) {
    notFound();
  }

  const similar = await getSimilarAttractions(attraction);

  return (
    <>
      <Breadcrumb
        links={[
          { label: "Home", href: "/" },
          { label: "Attractions", href: "/attractions" },
          { label: attraction.city, href: `/attractions?q=${encodeURIComponent(attraction.city)}#results` },
        ]}
        current={attraction.name}
      />
      <AttractionHeader attraction={attraction} />
      <SectionTabs
        sections={sections}
        action={
          <div className="hidden shrink-0 items-center gap-4 lg:flex">
            <span className="text-2xl font-bold text-primary">
              <Price amount={attraction.price} currency={attraction.currency} />
            </span>
            <ButtonLink href="#tickets" size="sm">
              See tickets
            </ButtonLink>
          </div>
        }
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-4">
          <TicketSelector attraction={attraction} />
          <AttractionOverview attraction={attraction} />
          <ReviewsSection
            rating={attraction.rating}
            reviewCount={attraction.reviewCount}
            scores={attraction.reviewScores}
            reviews={attraction.reviews}
            maxScore={5}
            compact
          />
        </div>

        <div className="flex flex-col gap-4">
          <PolicyList id="know-before" title="Know before you go" policies={attraction.policies} compact />
          <LocationSection address={attraction.address} nearby={attraction.nearby} compact>
            <ButtonLink
              href={`/hotels/list?destination=${encodeURIComponent(attraction.city)}`}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Find hotels in {attraction.city}
            </ButtonLink>
          </LocationSection>
          <AttractionBookCard attraction={attraction} />
        </div>
      </div>

      <SimilarAttractions attractions={similar} />
    </>
  );
};

const AttractionDetailsScreen = ({ params }: AttractionDetailsScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<HotelDetailsSkeleton />}>
          <AttractionDetailsContent params={params} />
        </Suspense>
      </div>
    </div>
  );
};

export default AttractionDetailsScreen;
