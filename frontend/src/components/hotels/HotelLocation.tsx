import type { HotelDetails } from "@/types";
import Icon from "../ui/Icon";

type HotelLocationProps = {
  hotel: HotelDetails;
};

const HotelLocation = ({ hotel }: HotelLocationProps) => {
  return (
    <section id="location" className="mt-10 scroll-mt-32">
      <h2 className="mb-1 text-xl font-bold">Location</h2>
      <p className="mb-4 flex items-center gap-1.5 text-sm text-muted">
        <Icon name="location" />
        {hotel.address}, {hotel.city}, {hotel.country}
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {hotel.nearby.map((place) => (
          <li key={place.id} className="flex items-center gap-3 rounded-card border border-line p-3">
            <Icon name={place.iconName} className="text-primary" />
            <div>
              <p className="text-sm font-medium">{place.name}</p>
              <p className="text-xs text-muted">{place.distance}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelLocation;
