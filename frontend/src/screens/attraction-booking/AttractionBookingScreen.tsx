import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  AttractionBookingForm,
  AttractionBookingSummary,
  AttractionTripCard,
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
      <h1 className="sr-only">Complete your booking</h1>
      <BookingSteps current={2} />
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_23.5rem]">
        <AttractionTripCard attraction={attraction} ticket={ticket} trip={trip} />
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <AttractionBookingSummary attraction={attraction} ticket={ticket} trip={trip} />
        </div>
        <AttractionBookingForm trip={trip} contact={toContactDefaults(await getCurrentUser())} />
      </div>
    </>
  );
};

const AttractionBookingScreen = ({ params, searchParams }: AttractionBookingScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<HotelDetailsSkeleton />}>
          <AttractionBookingContent params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default AttractionBookingScreen;
