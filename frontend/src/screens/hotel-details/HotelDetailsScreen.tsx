import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  HandpickedHotels,
  HotelAmenities,
  HotelBreadcrumb,
  HotelDetailsSkeleton,
  HotelGallery,
  HotelHeader,
  HotelLocation,
  HotelOverview,
  HotelPolicies,
  HotelReviews,
  HotelRooms,
  HotelSectionTabs,
} from "@/components";
import { parseHotelSearch } from "@/lib";
import { getHotelBySlug, getSimilarHotels } from "@/services";
import type { RouteParams } from "@/types";

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
      <HotelBreadcrumb hotel={hotel} />
      <HotelGallery name={hotel.name} images={hotel.images} />
      <HotelHeader hotel={hotel} />
      <HotelSectionTabs />
      <HotelOverview hotel={hotel} />
      <HotelRooms hotel={hotel} search={parseHotelSearch(query)} />
      <HotelAmenities amenities={hotel.amenities} />
      <HotelReviews hotel={hotel} />
      <HotelPolicies policies={hotel.policies} />
      <HotelLocation hotel={hotel} />
      <HandpickedHotels title="You may also like" moreHref="/hotels" hotels={similarHotels} />
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
