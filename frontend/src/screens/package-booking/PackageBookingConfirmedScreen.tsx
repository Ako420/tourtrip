import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSteps, ButtonLink, FlightResultsSkeleton, Icon, PackageBookingSummary } from "@/components";
import { parsePackageReference, parsePackageSearch, parsePackageSelection } from "@/lib";
import { getPackageOffer } from "@/services";
import type { RouteParams } from "@/types";

type PackageBookingConfirmedScreenProps = {
  searchParams: Promise<RouteParams>;
};

const PackageBookingConfirmedContent = async ({ searchParams }: PackageBookingConfirmedScreenProps) => {
  const params = await searchParams;
  const search = parsePackageSearch(params);
  const selection = parsePackageSelection(params);
  const reference = parsePackageReference(params);
  const hasDates = Boolean(search.departDate && search.returnDate);
  const offer = reference && hasDates ? await getPackageOffer(search, selection) : null;

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
              ? "This is a demo, so no flight or room was reserved and no email was sent."
              : `Your flight with ${offer.flight.airline} and your stay at ${offer.hotel.name} are saved under one reference.`}
          </p>

          <p className="mt-5 rounded-md bg-surface-alt p-4">
            <span className="block text-sm text-muted">Booking reference</span>
            <span className="text-xl font-bold tracking-wide">{reference}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/packages">Back to Flight + Hotel</ButtonLink>
            <ButtonLink href={`/attractions?q=${encodeURIComponent(search.to ?? "")}`} variant="outline">
              Things to do in {search.to}
            </ButtonLink>
          </div>
        </section>

        <PackageBookingSummary offer={offer} search={search} />
      </div>
    </>
  );
};

const PackageBookingConfirmedScreen = ({ searchParams }: PackageBookingConfirmedScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <PackageBookingConfirmedContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PackageBookingConfirmedScreen;
