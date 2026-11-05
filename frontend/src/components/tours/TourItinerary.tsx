import type { TourDay } from "@/types";

type TourItineraryProps = {
  days: TourDay[];
};

const TourItinerary = ({ days }: TourItineraryProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Your itinerary</h2>
      <ol className="flex flex-col gap-4 border-l-2 border-line pl-5">
        {days.map((day, index) => (
          <li key={day.title} className="relative">
            <span className="absolute top-1.5 -left-[1.6875rem] size-3 rounded-full bg-primary" />
            <h3 className="font-semibold">
              Day {index + 1}: {day.title}
            </h3>
            <p className="mt-0.5 text-sm text-ink-soft">{day.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default TourItinerary;
