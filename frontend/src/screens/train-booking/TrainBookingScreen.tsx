import { Suspense } from "react";
import {
  BookingSteps,
  BookingTripCard,
  ButtonLink,
  FlightResultsSkeleton,
  StatusMessage,
  TrainBookingForm,
  TrainBookingSummary,
} from "@/components";
import { formatPrice, getSeatProblem, parseTrainBookingParams, parseTrainSearch, toTrainQuery, toContactDefaults } from "@/lib";
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
      <h1 className="sr-only">Complete your booking</h1>
      <BookingSteps current={2} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-x-10">
        <BookingTripCard
          destination={search.to}
          carrier={offer.operator}
          detail={`${offer.trainNumber} · ${offer.seatClass} class`}
          legs={offer.inbound ? [offer.outbound, offer.inbound] : [offer.outbound]}
          vehicle="train"
          change={{ href: `/trains/results?${toTrainQuery(search)}`, label: "Change train" }}
        />
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <TrainBookingSummary offer={offer} search={search} />
        </div>
        <TrainBookingForm
          trip={trip}
          total={formatPrice(offer.totalPrice, offer.currency)}
          contact={toContactDefaults(await getCurrentUser())}
        />
      </div>
    </>
  );
};

const TrainBookingScreen = ({ searchParams }: TrainBookingScreenProps) => {
  return (
    <div className="-mx-4 -my-4 bg-surface-alt px-4 py-4 lg:-mx-8 lg:-my-8 lg:px-8 lg:py-6">
      <div className="mx-auto max-w-content pb-8">
        <Suspense fallback={<FlightResultsSkeleton />}>
          <TrainBookingContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
};

export default TrainBookingScreen;
