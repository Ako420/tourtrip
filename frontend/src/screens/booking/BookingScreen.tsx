import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  BookingForm,
  BookingSteps,
  BookingSummary,
  ButtonLink,
  HotelDetailsSkeleton,
  StatusMessage,
} from "@/components";
import { checkRoom, parseBookingParams, parseHotelSearch, toSearchQuery, toContactDefaults } from "@/lib";
import { getCurrentUser, getHotelBySlug } from "@/services";
import type { RouteParams } from "@/types";

type BookingScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const BookingContent = async ({ params, searchParams }: BookingScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

  const search = parseHotelSearch(query);
  const { roomId } = parseBookingParams(query);
  const { room, problem } = checkRoom(hotel, roomId, search);
  const backHref = `/hotels/${slug}?${toSearchQuery(search)}#rooms`;

  if (!room || !search.checkIn || !search.checkOut) {
    return (
      <StatusMessage iconName="calendar" title="We can't book this room yet" description={problem ?? ""}>
        <ButtonLink href={backHref}>Back to rooms</ButtonLink>
      </StatusMessage>
    );
  }

  const stay = {
    slug,
    roomId: room.id,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    rooms: search.rooms,
    adults: search.adults,
    children: search.children,
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Complete your booking</h1>
        <BookingSteps current={1} />
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1">
          <BookingForm stay={stay} contact={toContactDefaults(await getCurrentUser())} />
        </div>
        <div className="order-1 lg:order-2">
          <BookingSummary hotel={hotel} room={room} search={search} />
        </div>
      </div>
    </>
  );
};

const BookingScreen = ({ params, searchParams }: BookingScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <BookingContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default BookingScreen;
