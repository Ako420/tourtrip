import { Suspense } from "react";
import {
  BookingSteps,
  ButtonLink,
  FlightResultsSkeleton,
  StatusMessage,
  TrainBookingForm,
  TrainBookingSummary,
} from "@/components";
import { getSeatProblem, parseTrainBookingParams, parseTrainSearch, toTrainQuery, toContactDefaults } from "@/lib";
import { flightSearchSchema } from "@/schemas";
import { getCurrentUser, getTrainOffer } from "@/services";
import type { RouteParams } from "@/types";

type TrainBookingScreenProps = {
  searchParams: Promise<RouteParams>;
};

const TrainBookingContent = async ({ searchParams }: TrainBookingScreenProps) => {
  const params = await searchParams;
  const search = parseTrainSearch(params);
  const { offerId } = parseTrainBookingParams(params);
  const isValidSearch = flightSearchSchema.safeParse({ ...search, departDate: search.departDate ?? "" }).success;
  const offer = isValidSearch ? await getTrainOffer(search, offerId) : null;
  const problem = offer ? getSeatProblem(offer, search) : "This train could not be found.";

  if (!offer || problem || !search.from || !search.to || !search.departDate) {
    return (
      <StatusMessage iconName="train" title="We can't book this train yet" description={problem ?? ""}>
        <ButtonLink href={`/trains/results?${toTrainQuery(search)}`}>Back to trains</ButtonLink>
      </StatusMessage>
    );
  }

  const trip = {
    offerId,
    from: search.from,
    to: search.to,
    tripType: search.tripType,
    departDate: search.departDate,
    returnDate: search.returnDate,
    adults: search.adults,
    children: search.children,
    seatClass: search.seatClass,
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Complete your booking</h1>
        <BookingSteps current={2} />
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1">
          <TrainBookingForm trip={trip} contact={toContactDefaults(await getCurrentUser())} />
        </div>
        <div className="order-1 lg:order-2">
          <TrainBookingSummary offer={offer} search={search} />
        </div>
      </div>
    </>
  );
};

const TrainBookingScreen = ({ searchParams }: TrainBookingScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<FlightResultsSkeleton />}>
        <TrainBookingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TrainBookingScreen;
