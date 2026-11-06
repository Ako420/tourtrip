import type { HotelSummary } from "@/types";
import HotelStayCard from "./HotelStayCard";

type HotelGridProps = {
  title: string;
  hotels: HotelSummary[];
};

const HotelGrid = ({ title, hotels }: HotelGridProps) => {
  if (hotels.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-content">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <HotelStayCard hotel={hotel} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelGrid;
