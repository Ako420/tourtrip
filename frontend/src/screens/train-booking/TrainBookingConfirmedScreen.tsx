import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSteps, BookingTripCard, ButtonLink, FlightResultsSkeleton, Icon, TrainBookingSummary } from "@/components";
import { parseTrainBookingParams, parseTrainSearch } from "@/lib";
import { getTrainOffer } from "@/services";
import type { RouteParams } from "@/types";

type TrainBookingConfirmedScreenProps = {
  searchParams: Promise<RouteParams>;
};

const TrainBookingConfirmedContent = async ({ searchParams }: TrainBookingConfirmedScreenProps) => {
  const params = await searchParams;
  const search = parseTrainSearch(params);
  const { offerId, reference } = parseTrainBookingParams(params);
  const offer = reference && search.departDate ? await getTrainOffer(search, offerId) : null;

  if (!offer) {
    notFound();
  }

  const isDemo = reference.startsWith("DEMO-");

  return (
    <>
      <BookingSteps current={3} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-x-10">
        <section className="rounded-card bg-surface p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary-soft text-2xl text-success">
            <Icon name="check" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">{isDemo ? "Demo booking complete" : "We have your booking"}</h1>
          <p className="mt-1 text-ink-soft">
            {isDemo
              ? "This is a demo, so no seat was reserved, no ticket was issued and no email was sent."
              : `Your trip from ${search.from} to ${search.to} is saved.`}
          </p>

          <p className="mt-5 rounded-md bg-surface-alt p-4">
            <span className="block text-sm text-muted">Booking reference</span>
            <span className="text-xl font-bold tracking-wide">{reference}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/trains">Back to trains</ButtonLink>
            <ButtonLink href={`/hotels/list?destination=${encodeURIComponent(search.to ?? "")}`} variant="outline">
              Find a hotel in {search.to}
            </ButtonLink>
          </div>
        </section>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <TrainBookingSummary offer={offer} search={search} />
        </div>
        <BookingTripCard
          destination={search.to}
          carrier={offer.operator}
          detail={`${offer.trainNumber} · ${offer.seatClass} class`}
          legs={offer.inbound ? [offer.outbound, offer.inbound] : [offer.outbound]}
          vehicle="train"
        />
      </div>
    </>
  );
};

const TrainBookingConfirmedScreen = ({ searchParams }: TrainBookingConfirmedScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<FlightResultsSkeleton />}>
          <TrainBookingConfirmedContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default TrainBookingConfirmedScreen;
