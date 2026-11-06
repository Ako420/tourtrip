import { formatCount, getRatingLabel } from "@/lib";
import type { HotelReview, ReviewScore } from "@/types";
import Carousel from "./Carousel";

type ReviewsSectionProps = {
  rating: number;
  reviewCount: number;
  scores: ReviewScore[];
  reviews: HotelReview[];
  maxScore?: number;
  compact?: boolean;
};

const ReviewsSection = ({ rating, reviewCount, scores, reviews, maxScore = 10, compact = false }: ReviewsSectionProps) => {
  const reviewCards = reviews.map((review) => (
    <article key={review.id} className="flex h-full flex-col rounded-card border border-line p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary">
            {review.author[0]}
          </span>
          <div>
            <p className="text-sm font-bold">{review.author}</p>
            <p className="text-xs text-ink-soft">{review.country}</p>
          </div>
        </div>
        <span className="text-lg font-bold text-primary">{review.score.toFixed(1)}</span>
      </div>
      <p className="mt-3 text-sm font-medium">{review.title}</p>
      <p className="mt-1 flex-1 text-sm text-ink-soft">{review.text}</p>
      <p className="mt-3 text-xs text-muted">Stayed {review.stayDate}</p>
    </article>
  ));

  return (
    <section id="reviews" className={`scroll-mt-32 ${compact ? "rounded-card bg-surface p-5" : "mt-10"}`}>
      <h2 className="mb-4 text-2xl font-bold">Guest reviews</h2>

      <div className={compact ? "grid gap-6" : "grid gap-8 md:grid-cols-[17rem_minmax(0,1fr)]"}>
        <div>
          <p className="flex items-center gap-3">
            <span className="text-4xl font-bold text-primary">
              {rating.toFixed(1)}
              <span className="text-sm font-normal text-ink-soft">/{maxScore}</span>
            </span>
            <span>
              <span className="block font-bold text-primary">{getRatingLabel((rating / maxScore) * 10)}</span>
              <span className="text-sm">{formatCount(reviewCount, "review")}</span>
            </span>
          </p>

          <ul className={`mt-5 gap-x-8 gap-y-4 ${compact ? "grid sm:grid-cols-2" : "grid"}`}>
            {scores.map((score) => (
              <li key={score.id}>
                <p className="flex justify-between text-sm">
                  {score.label}
                  <span className="font-semibold">{score.score.toFixed(1)}</span>
                </p>
                <div className="mt-1 h-1 rounded-full bg-line">
                  <div className="h-full rounded-full bg-primary-deep" style={{ width: `${(score.score / maxScore) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="mb-3 font-bold">What guests say</h3>
          {compact ? (
            <div className="flex flex-col gap-3">{reviewCards}</div>
          ) : (
            <Carousel label="reviews" slideClassName="w-72">
              {reviewCards}
            </Carousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
