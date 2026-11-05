import type { Tour } from "@/types";
import TourCard from "./TourCard";

type TourGridProps = {
  tours: Tour[];
};

const TourGrid = ({ tours }: TourGridProps) => {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <li key={tour.id}>
          <TourCard tour={tour} />
        </li>
      ))}
    </ul>
  );
};

export default TourGrid;
