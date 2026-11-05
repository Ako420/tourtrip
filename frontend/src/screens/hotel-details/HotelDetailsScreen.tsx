import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  Breadcrumb,
  HandpickedHotels,
  HotelAmenities,
  HotelDetailsSkeleton,
  HotelGallery,
  HotelHeader,
  HotelOverview,
  HotelRooms,
  LocationSection,
  PolicyList,
  ReviewsSection,
  SectionTabs,
} from "@/components";
import { parseHotelSearch } from "@/lib";
import { getHotelBySlug, getSimilarHotels } from "@/services";
import type { RouteParams } from "@/types";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Rooms" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "policies", label: "Policies" },
  { id: "location", label: "Location" },
];

type HotelDetailsScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const HotelDetailsContent = async ({ params, searchParams }: HotelDetailsScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

  const similarHotels = await getSimilarHotels(hotel);

  return (
    <>
      <Breadcrumb
        links={[
          { label: "Home", href: "/" },
          { label: "Hotels", href: "/hotels" },
          { label: hotel.city, href: `/hotels/list?destination=${encodeURIComponent(hotel.city)}` },
        ]}
        current={hotel.name}
      />
      <HotelGallery name={hotel.name} images={hotel.images} />
      <HotelHeader hotel={hotel} />
      <SectionTabs sections={sections} />
      <HotelOverview hotel={hotel} />
      <HotelRooms hotel={hotel} search={parseHotelSearch(query)} />
      <HotelAmenities amenities={hotel.amenities} />
      <ReviewsSection
        rating={hotel.rating}
        reviewCount={hotel.reviewCount}
        scores={hotel.reviewScores}
        reviews={hotel.reviews}
      />
      <PolicyList policies={hotel.policies} />
      <LocationSection address={`${hotel.address}, ${hotel.city}, ${hotel.country}`} nearby={hotel.nearby} />
      <HandpickedHotels title="You may also like" moreHref="/hotels/list" hotels={similarHotels} />
    </>
  );
};

const HotelDetailsScreen = ({ params, searchParams }: HotelDetailsScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <HotelDetailsContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default HotelDetailsScreen;
