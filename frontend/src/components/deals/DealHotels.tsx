import type { HotelSummary } from "@/types";
import HotelStayCard from "../hotels/HotelStayCard";
import SectionHeading from "../ui/SectionHeading";

type DealHotelsProps = {
  title: string;
  hotels: HotelSummary[];
};

const DealHotels = ({ title, hotels }: DealHotelsProps) => {
  if (hotels.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{title}</SectionHeading>

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

export default DealHotels;
