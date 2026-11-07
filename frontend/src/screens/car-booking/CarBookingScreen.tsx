import { Suspense } from "react";
import {
  BookingSteps,
  ButtonLink,
  CarBookingForm,
  CarBookingSummary,
  FlightResultsSkeleton,
  StatusMessage,
} from "@/components";
import { parseCarBookingParams, parseCarSearch, toCarQuery, toContactDefaults } from "@/lib";
import { carSearchSchema } from "@/schemas";
import { getCurrentUser, getCarOffer } from "@/services";
import type { RouteParams } from "@/types";

type CarBookingScreenProps = {
  searchParams: Promise<RouteParams>;
};

const CarBookingContent = async ({ searchParams }: CarBookingScreenProps) => {
  const params = await searchParams;
  const search = parseCarSearch(params);
  const { offerId } = parseCarBookingParams(params);
  const isValidSearch = carSearchSchema.safeParse({
    ...search,
    location: search.location ?? "",
    pickupDate: search.pickupDate ?? "",
    dropoffDate: search.dropoffDate ?? "",
    hasDifferentDropoff: Boolean(search.dropoffLocation),
  }).success;
  const offer = isValidSearch ? await getCarOffer(search, offerId) : null;

  if (!offer || !search.location || !search.pickupDate || !search.dropoffDate) {
    return (
      <StatusMessage iconName="car" title="We can't book this car yet" description="This car could not be found.">
        <ButtonLink href={`/cars/results?${toCarQuery(search)}`}>Back to cars</ButtonLink>
      </StatusMessage>
    );
  }

  const trip = {
    offerId,
    location: search.location,
    dropoffLocation: search.dropoffLocation,
    pickupDate: search.pickupDate,
    pickupTime: search.pickupTime,
    dropoffDate: search.dropoffDate,
    dropoffTime: search.dropoffTime,
    isStandardAge: search.isStandardAge,
  };

  return (
    <>
      <h1 className="sr-only">Complete your booking</h1>
      <BookingSteps current={2} />
      <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18.75rem]">
        <div className="order-2 lg:order-1">
          <CarBookingForm trip={trip} contact={toContactDefaults(await getCurrentUser())} />
        </div>
        <div className="order-1 lg:order-2">
          <CarBookingSummary offer={offer} search={search} />
        </div>
      </div>
    </>
  );
};

const CarBookingScreen = ({ searchParams }: CarBookingScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<FlightResultsSkeleton />}>
          <CarBookingContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default CarBookingScreen;
