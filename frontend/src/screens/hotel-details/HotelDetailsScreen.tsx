import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BookingOffers,
  ButtonLink,
  HandpickedHotels,
  HotelAmenities,
  HotelBestPrice,
  HotelDescription,
  HotelDetailsSkeleton,
  HotelGallery,
  HotelHeader,
  HotelOverview,
  HotelRooms,
  LocationSection,
  PolicyList,
  Price,
  ReviewsSection,
  SearchForm,
  SectionTabs,
} from "@/components";
import { getLowestRoom, parseHotelSearch, toSearchQuery } from "@/lib";
import { getDestinations, getHotelBySlug, getSimilarHotels } from "@/services";
import type { RouteParams } from "@/types";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "rooms", label: "Rooms" },
  { id: "reviews", label: "Guest Reviews" },
  { id: "amenities", label: "Services & Amenities" },
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

  const [similarHotels, destinations] = await Promise.all([getSimilarHotels(hotel), getDestinations()]);
  const search = parseHotelSearch(query);
  const lowestRoom = getLowestRoom(hotel);

  return (
    <>
      <SearchForm
        key={toSearchQuery(search)}
        initialValues={{ ...search, destination: hotel.city }}
        destinations={destinations}
        highlighted
      />
      <HotelHeader hotel={hotel} />
      <HotelGallery name={hotel.name} images={hotel.images} />

      <div id="overview" className="mt-6 grid scroll-mt-32 gap-8 lg:grid-cols-[minmax(0,1fr)_23.5rem]">
        <HotelOverview hotel={hotel} />
        <HotelBestPrice hotel={hotel} search={search} />
      </div>

      <div className="mt-8">
        <BookingOffers />
      </div>

      <SectionTabs
        sections={sections}
        action={
          lowestRoom && (
            <div className="hidden shrink-0 items-center gap-4 lg:flex">
              <span className="text-2xl font-bold text-primary">
                <Price amount={lowestRoom.pricePerNight} currency={hotel.currency} />
              </span>
              <ButtonLink href="#rooms" size="sm">
                Select rooms
              </ButtonLink>
            </div>
          )
        }
      />
      <HotelRooms hotel={hotel} search={search} />
      <ReviewsSection
        rating={hotel.rating}
        reviewCount={hotel.reviewCount}
        scores={hotel.reviewScores}
        reviews={hotel.reviews}
      />
      <LocationSection address={`${hotel.address}, ${hotel.city}, ${hotel.country}`} nearby={hotel.nearby} />
      <HotelAmenities amenities={hotel.amenities} />
      <PolicyList policies={hotel.policies} title="Property policies" />
      <HotelDescription hotel={hotel} />
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
