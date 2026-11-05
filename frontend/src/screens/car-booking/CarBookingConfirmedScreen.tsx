import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSteps, ButtonLink, CarBookingSummary, FlightResultsSkeleton, Icon } from "@/components";
import { parseCarBookingParams, parseCarSearch } from "@/lib";
import { getCarOffer } from "@/services";
import type { RouteParams } from "@/types";

type CarBookingConfirmedScreenProps = {
  searchParams: Promise<RouteParams>;
};

const CarBookingConfirmedContent = async ({ searchParams }: CarBookingConfirmedScreenProps) => {
  const params = await searchParams;
  const search = parseCarSearch(params);
  const { offerId, reference } = parseCarBookingParams(params);
  const hasDates = Boolean(search.pickupDate && search.dropoffDate);
  const offer = reference && hasDates ? await getCarOffer(search, offerId) : null;

  if (!offer) {
    notFound();
  }

  const isDemo = reference.startsWith("DEMO-");

  return (
    <>
      <BookingSteps current={2} />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-card border border-line p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-2xl text-success">
            <Icon name="check" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">{isDemo ? "Demo booking complete" : "We have your booking"}</h1>
          <p className="mt-1 text-ink-soft">
            {isDemo
              ? "This is a demo, so no car was reserved and no email was sent."
              : `Your rental with ${offer.supplier} is saved. Pay at the counter when you collect the car.`}
          </p>

          <p className="mt-5 rounded-md bg-surface-alt p-4">
            <span className="block text-sm text-muted">Booking reference</span>
            <span className="text-xl font-bold tracking-wide">{reference}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/cars">Back to cars</ButtonLink>
            <ButtonLink href={`/hotels/list?destination=${encodeURIComponent(search.location ?? "")}`} variant="outline">
              Find a hotel in {search.location}
            </ButtonLink>
          </div>
        </section>

        <CarBookingSummary offer={offer} search={search} />
      </div>
    </>
  );
};

const CarBookingConfirmedScreen = ({ searchParams }: CarBookingConfirmedScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <CarBookingConfirmedContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default CarBookingConfirmedScreen;
