import type { Amenity } from "@/types";
import Icon from "../ui/Icon";

type HotelAmenitiesProps = {
  amenities: Amenity[];
};

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  return (
    <section id="amenities" className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-2xl font-bold">Services &amp; amenities</h2>
      <ul className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {amenities.map((amenity) => (
          <li key={amenity.id} className="flex items-center gap-3">
            <Icon name={amenity.iconName} className="w-4" />
            {amenity.label}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelAmenities;
