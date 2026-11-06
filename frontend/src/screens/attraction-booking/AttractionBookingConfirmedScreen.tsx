import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AttractionBookingSummary, BookingSteps, ButtonLink, HotelDetailsSkeleton, Icon } from "@/components";
import { parseAttractionBooking } from "@/lib";
import { getAttractionBySlug } from "@/services";
import type { RouteParams } from "@/types";

type AttractionBookingConfirmedScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const AttractionBookingConfirmedContent = async ({ params, searchParams }: AttractionBookingConfirmedScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const attraction = await getAttractionBySlug(slug);
  const { trip, reference } = parseAttractionBooking(slug, query);
  const ticket = attraction?.tickets.find((item) => item.id === trip.ticketId);

  if (!attraction || !ticket || !reference || !trip.date) {
    notFound();
  }

  const isDemo = reference.startsWith("DEMO-");

  return (
    <>
      <BookingSteps current={3} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-card border border-line p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-2xl text-success">
            <Icon name="check" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">{isDemo ? "Demo booking complete" : "We have your booking"}</h1>
          <p className="mt-1 text-ink-soft">
            {isDemo
              ? "This is a demo, so no ticket was issued and no email was sent."
              : `Your ${ticket.name.toLowerCase()} for ${attraction.name} is saved.`}
          </p>

          <p className="mt-5 rounded-md bg-surface-alt p-4">
            <span className="block text-sm text-muted">Booking reference</span>
            <span className="text-xl font-bold tracking-wide">{reference}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/attractions">Find more things to do</ButtonLink>
            <ButtonLink href={`/hotels/list?destination=${encodeURIComponent(attraction.city)}`} variant="outline">
              Find a hotel in {attraction.city}
            </ButtonLink>
          </div>
        </section>

        <AttractionBookingSummary attraction={attraction} ticket={ticket} trip={trip} />
      </div>
    </>
  );
};

const AttractionBookingConfirmedScreen = ({ params, searchParams }: AttractionBookingConfirmedScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <AttractionBookingConfirmedContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default AttractionBookingConfirmedScreen;
