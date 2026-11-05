import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AttractionHeader,
  AttractionOverview,
  Breadcrumb,
  ButtonLink,
  HotelDetailsSkeleton,
  LocationSection,
  PolicyList,
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
  { id: "overview", label: "Overview" },
  { id: "tickets", label: "Tickets" },
  { id: "reviews", label: "Reviews" },
  { id: "know-before", label: "Know before you go" },
  { id: "location", label: "Location" },
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
      <SectionTabs sections={sections} />
      <AttractionOverview attraction={attraction} />
      <TicketSelector attraction={attraction} />
      <ReviewsSection
        rating={attraction.rating}
        reviewCount={attraction.reviewCount}
        scores={attraction.reviewScores}
        reviews={attraction.reviews}
        maxScore={5}
      />
      <PolicyList id="know-before" title="Know before you go" policies={attraction.policies} />
      <LocationSection address={attraction.address} nearby={attraction.nearby}>
        <ButtonLink
          href={`/hotels/list?destination=${encodeURIComponent(attraction.city)}`}
          variant="outline"
          size="sm"
          className="mt-4"
        >
          Find hotels in {attraction.city}
        </ButtonLink>
      </LocationSection>
      <SimilarAttractions attractions={similar} />
    </>
  );
};

const AttractionDetailsScreen = ({ params }: AttractionDetailsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <AttractionDetailsContent params={params} />
      </Suspense>
    </div>
  );
};

export default AttractionDetailsScreen;
