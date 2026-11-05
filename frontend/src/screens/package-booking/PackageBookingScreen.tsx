import { Suspense } from "react";
import {
  BookingSteps,
  ButtonLink,
  FlightResultsSkeleton,
  PackageBookingForm,
  PackageBookingSummary,
  StatusMessage,
} from "@/components";
import { parsePackageSearch, parsePackageSelection, toContactDefaults, toPackageQuery } from "@/lib";
import { packageSearchSchema } from "@/schemas";
import { getCurrentUser, getPackageOffer } from "@/services";
import type { RouteParams } from "@/types";

type PackageBookingScreenProps = {
  searchParams: Promise<RouteParams>;
};

const PackageBookingContent = async ({ searchParams }: PackageBookingScreenProps) => {
  const params = await searchParams;
  const search = parsePackageSearch(params);
  const selection = parsePackageSelection(params);
  const isValidSearch = packageSearchSchema.safeParse(search).success;
  const offer = isValidSearch ? await getPackageOffer(search, selection) : null;
  const { from, to, departDate, returnDate } = search;

  if (!offer || !from || !to || !departDate || !returnDate) {
    return (
      <StatusMessage iconName="building" title="We can't book this package yet" description="This package could not be found.">
        <ButtonLink href={`/packages/results?${toPackageQuery(search)}`}>Back to packages</ButtonLink>
      </StatusMessage>
    );
  }

  const trip = { ...selection, ...search, from, to, departDate, returnDate };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Complete your booking</h1>
        <BookingSteps current={1} />
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1">
          <PackageBookingForm trip={trip} contact={toContactDefaults(await getCurrentUser())} />
        </div>
        <div className="order-1 lg:order-2">
          <PackageBookingSummary offer={offer} search={search} />
        </div>
      </div>
    </>
  );
};

const PackageBookingScreen = ({ searchParams }: PackageBookingScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <PackageBookingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default PackageBookingScreen;
