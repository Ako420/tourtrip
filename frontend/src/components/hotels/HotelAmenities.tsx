import type { Amenity } from "@/types";
import Icon from "../ui/Icon";

type HotelAmenitiesProps = {
  amenities: Amenity[];
};

const HotelAmenities = ({ amenities }: HotelAmenitiesProps) => {
  return (
    <section id="amenities" className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-xl font-bold">Amenities</h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {amenities.map((amenity) => (
          <li key={amenity.id} className="flex items-center gap-3 rounded-card bg-surface-alt p-3 text-sm font-medium">
            <Icon name={amenity.iconName} className="text-lg text-primary" />
            {amenity.label}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelAmenities;
