import { formatShortDate } from "@/lib";
import type { CarsContent } from "@/types";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";

type CarReviewsProps = {
  section: CarsContent["reviews"];
};

const CarReviews = ({ section }: CarReviewsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <p className="-mt-3 mb-4 text-sm text-muted">{section.note}</p>

      <Carousel label="reviews" slideClassName="w-72 sm:w-80 lg:w-[calc((100%-2rem)/3)]">
        {section.items.map((review) => (
          <article key={review.id} className="h-full rounded-card border border-line p-4">
            <div className="flex items-center gap-3">
              <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary">
                {review.author[0]}
              </span>
              <div>
                <h3>{review.author}</h3>
                <p className="w-fit rounded-md bg-primary-deep px-1.5 text-xs font-medium text-white">
                  {review.score.toFixed(1)} / 5.0
                </p>
              </div>
            </div>
            <p className="mt-3 border-b border-line pb-3 text-xs text-muted">
              {formatShortDate(review.date)} | {review.carType}
            </p>
            <p className="mt-3 text-sm">{review.text}</p>
          </article>
        ))}
      </Carousel>
    </section>
  );
};

export default CarReviews;
