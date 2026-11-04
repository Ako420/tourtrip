import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingSteps, BookingSummary, ButtonLink, HotelDetailsSkeleton, Icon } from "@/components";
import { parseBookingParams, parseHotelSearch } from "@/lib";
import { getHotelBySlug } from "@/services";
import type { RouteParams } from "@/types";

type BookingConfirmedScreenProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RouteParams>;
};

const BookingConfirmedContent = async ({ params, searchParams }: BookingConfirmedScreenProps) => {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const hotel = await getHotelBySlug(slug);
  const { roomId, reference } = parseBookingParams(query);
  const search = parseHotelSearch(query);
  const room = hotel?.rooms.find((item) => item.id === roomId);

  if (!hotel || !room || !reference || !search.checkIn || !search.checkOut) {
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
          <h1 className="mt-4 text-2xl font-bold">{isDemo ? "Demo booking complete" : "Your booking is confirmed"}</h1>
          <p className="mt-1 text-ink-soft">
            {isDemo
              ? "This is a demo, so no room was reserved and no email was sent."
              : `We look forward to welcoming you to ${hotel.name}. Pay when you arrive.`}
          </p>

          <p className="mt-5 rounded-md bg-surface-alt p-4">
            <span className="block text-sm text-muted">Booking reference</span>
            <span className="text-xl font-bold tracking-wide">{reference}</span>
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/hotels" variant="outline">
              Find another stay
            </ButtonLink>
          </div>
        </section>

        <BookingSummary hotel={hotel} room={room} search={search} />
      </div>
    </>
  );
};

const BookingConfirmedScreen = ({ params, searchParams }: BookingConfirmedScreenProps) => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<HotelDetailsSkeleton />}>
        <BookingConfirmedContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default BookingConfirmedScreen;
