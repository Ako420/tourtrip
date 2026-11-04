import Icon from "./Icon";

type StarRatingProps = {
  stars: number;
};

const StarRating = ({ stars }: StarRatingProps) => {
  return (
    <span className="inline-flex gap-0.5 text-xs text-star" role="img" aria-label={`${stars} star hotel`}>
      {Array.from({ length: stars }, (_, index) => (
        <Icon key={index} name="star" />
      ))}
    </span>
  );
};

export default StarRating;
