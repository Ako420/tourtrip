import { formatCount, getRatingLabel } from "@/lib";

type ReviewScoreProps = {
  rating: number;
  reviewCount: number;
};

const ReviewScore = ({ rating, reviewCount }: ReviewScoreProps) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="rounded-md bg-primary px-1.5 py-0.5 font-semibold text-white">{rating.toFixed(1)}</span>
      <span className="font-medium">{getRatingLabel(rating)}</span>
      <span className="text-muted">{formatCount(reviewCount, "review")}</span>
    </div>
  );
};

export default ReviewScore;
