import { Suspense } from "react";
import {
  BookingSteps,
  ButtonLink,
  FlightBookingForm,
  FlightBookingSummary,
  FlightResultsSkeleton,
  StatusMessage,
} from "@/components";
import { getSeatProblem, parseFlightBookingParams, parseFlightSearch, toFlightQuery, toContactDefaults } from "@/lib";
import { flightSearchSchema } from "@/schemas";
import { getCurrentUser, getFlightOffer } from "@/services";
import type { RouteParams } from "@/types";

type FlightBookingScreenProps = {
  searchParams: Promise<RouteParams>;
};

const FlightBookingContent = async ({ searchParams }: FlightBookingScreenProps) => {
  const params = await searchParams;
  const search = parseFlightSearch(params);
  const { offerId } = parseFlightBookingParams(params);
  const isValidSearch = flightSearchSchema.safeParse({ ...search, departDate: search.departDate ?? "" }).success;
  const offer = isValidSearch ? await getFlightOffer(search, offerId) : null;
  const problem = !offer ? "This flight could not be found." : getSeatProblem(offer, search);

  if (!offer || problem || !search.from || !search.to || !search.departDate) {
    return (
      <StatusMessage iconName="plane" title="We can't book this flight yet" description={problem ?? ""}>
        <ButtonLink href={`/flights/results?${toFlightQuery(search)}`}>Back to flights</ButtonLink>
      </StatusMessage>
    );
  }

  const trip = {
    offerId,
    from: search.from,
    to: search.to,
    tripType: search.tripType,
    isNonstop: search.isNonstop,
    departDate: search.departDate,
    returnDate: search.returnDate,
    adults: search.adults,
    children: search.children,
    cabin: search.cabin,
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Complete your booking</h1>
        <BookingSteps current={2} />
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1">
          <FlightBookingForm trip={trip} contact={toContactDefaults(await getCurrentUser())} />
        </div>
        <div className="order-1 lg:order-2">
          <FlightBookingSummary offer={offer} search={search} />
        </div>
      </div>
    </>
  );
};

const FlightBookingScreen = ({ searchParams }: FlightBookingScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <FlightBookingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default FlightBookingScreen;
