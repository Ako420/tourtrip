"use client";

import { useState } from "react";
import { formatCount, getRatingLabel } from "@/lib";
import type { HotelDetails } from "@/types";

type HotelReviewsProps = {
  hotel: HotelDetails;
};

const INITIAL_COUNT = 3;

const HotelReviews = ({ hotel }: HotelReviewsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const reviews = isExpanded ? hotel.reviews : hotel.reviews.slice(0, INITIAL_COUNT);

  return (
    <section id="reviews" className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-xl font-bold">Guest reviews</h2>

      <div className="grid gap-6 rounded-card border border-line p-5 md:grid-cols-[12rem_1fr]">
        <div>
          <p className="text-4xl font-bold text-primary">{hotel.rating.toFixed(1)}</p>
          <p className="mt-1 font-semibold">{getRatingLabel(hotel.rating)}</p>
          <p className="text-sm text-muted">{formatCount(hotel.reviewCount, "review")}</p>
        </div>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {hotel.reviewScores.map((score) => (
            <li key={score.id}>
              <p className="flex justify-between text-sm">
                {score.label}
                <span className="font-semibold">{score.score.toFixed(1)}</span>
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-line">
                <div className="h-full rounded-full bg-primary" style={{ width: `${score.score * 10}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {reviews.map((review) => (
          <li key={review.id} className="py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{review.title}</p>
                <p className="text-sm text-muted">
                  {review.author}, {review.country} · Stayed {review.stayDate}
                </p>
              </div>
              <span className="rounded-md bg-primary-soft px-1.5 py-0.5 text-sm font-semibold text-primary">
                {review.score.toFixed(1)}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{review.text}</p>
          </li>
        ))}
      </ul>

      {hotel.reviews.length > INITIAL_COUNT && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {isExpanded ? "Show fewer reviews" : "Show more reviews"}
        </button>
      )}
    </section>
  );
};

export default HotelReviews;
