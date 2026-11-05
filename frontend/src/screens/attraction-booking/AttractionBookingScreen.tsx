import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AttractionBookingForm,
  AttractionBookingSummary,
  BookingSteps,
  ButtonLink,
  HotelDetailsSkeleton,
  StatusMessage,
} from "@/components";
import { parseAttractionBooking, toContactDefaults } from "@/lib";
import { getCurrentUser, getAttractionBySlug } from "@/services";
import type { RouteParams } from "@/types";

type AttractionBookingScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const AttractionBookingContent = async ({ params, searchParams }: AttractionBookingScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const attraction = await getAttractionBySlug(slug);

  if (!attraction) {
    notFound();
  }

  const { trip } = parseAttractionBooking(slug, query);
  const ticket = attraction.tickets.find((item) => item.id === trip.ticketId);

  if (!ticket || !trip.date) {
    return (
      <StatusMessage
        iconName="ticket"
        title="We can't book this ticket yet"
        description={ticket ? "Choose a visit date first." : "This ticket could not be found."}
      >
        <ButtonLink href={`/attractions/${slug}#tickets`}>Back to tickets</ButtonLink>
      </StatusMessage>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Complete your booking</h1>
        <BookingSteps current={1} />
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1">
          <AttractionBookingForm trip={trip} contact={toContactDefaults(await getCurrentUser())} />
        </div>
        <div className="order-1 lg:order-2">
          <AttractionBookingSummary attraction={attraction} ticket={ticket} trip={trip} />
        </div>
      </div>
    </>
  );
};

const AttractionBookingScreen = ({ params, searchParams }: AttractionBookingScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <AttractionBookingContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default AttractionBookingScreen;
