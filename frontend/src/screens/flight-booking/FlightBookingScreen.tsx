import { Suspense } from "react";
import {
  BookingSteps,
  ButtonLink,
  FlightBookingForm,
  FlightBookingSummary,
  FlightResultsSkeleton,
  FlightTripCard,
  StatusMessage,
} from "@/components";
import { formatPrice, getSeatProblem, parseFlightBookingParams, parseFlightSearch, toFlightQuery, toContactDefaults } from "@/lib";
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
      <h1 className="sr-only">Complete your booking</h1>
      <BookingSteps current={2} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-x-10">
        <FlightTripCard offer={offer} search={search} changeable />
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FlightBookingSummary offer={offer} search={search} />
        </div>
        <FlightBookingForm
          trip={trip}
          total={formatPrice(offer.totalPrice, offer.currency)}
          contact={toContactDefaults(await getCurrentUser())}
        />
      </div>
    </>
  );
};

const FlightBookingScreen = ({ searchParams }: FlightBookingScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<FlightResultsSkeleton />}>
          <FlightBookingContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default FlightBookingScreen;
