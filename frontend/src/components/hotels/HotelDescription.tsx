import type { HotelDetails } from "@/types";
import Icon from "../ui/Icon";

type HotelDescriptionProps = {
  hotel: HotelDetails;
};

const HotelDescription = ({ hotel }: HotelDescriptionProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-bold">Property description</h2>
      <p className="text-ink-soft">{hotel.description}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {hotel.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <Icon name="check" className="mt-0.5 text-primary" />
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelDescription;
