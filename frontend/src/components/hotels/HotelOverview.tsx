import { formatCount, getRatingLabel } from "@/lib";
import type { HotelDetails } from "@/types";
import Icon from "../ui/Icon";

type HotelOverviewProps = {
  hotel: HotelDetails;
};

const TOP_AMENITY_COUNT = 4;
const LISTED_AMENITY_COUNT = 8;
const LISTED_PLACE_COUNT = 6;

const titleClass = "text-xl font-bold";
const moreClass = "mt-3 inline-block text-sm font-medium underline hover:text-primary";

const HotelOverview = ({ hotel }: HotelOverviewProps) => {
  const moreAmenities = hotel.amenities.length - TOP_AMENITY_COUNT;

  return (
    <div className="min-w-0">
      <ul className="flex flex-wrap gap-6 border-b border-line pb-6 sm:gap-10">
        {hotel.amenities.slice(0, TOP_AMENITY_COUNT).map((amenity) => (
          <li key={amenity.id} className="w-20 text-center text-sm">
            <Icon name={amenity.iconName} className="text-2xl" />
            <span className="mt-2 block">{amenity.label}</span>
          </li>
        ))}
        {moreAmenities > 0 && (
          <li className="w-20 text-center text-sm">
            <a href="#amenities" className="block hover:text-primary">
              <Icon name="more" className="text-2xl" />
              <span className="mt-2 block">+{moreAmenities} more</span>
            </a>
          </li>
        )}
      </ul>

      <div className="flex items-center gap-5 border-b border-line py-5">
        <p className="text-4xl font-bold text-primary">{hotel.rating.toFixed(1)}</p>
        <div className="shrink-0">
          <p className={`${titleClass} text-primary`}>{getRatingLabel(hotel.rating)}</p>
          <a href="#reviews" className="text-sm underline hover:text-primary">
            All {formatCount(hotel.reviewCount, "review")}
          </a>
        </div>
        {hotel.reviews[0] && (
          <p className="line-clamp-2 border-l border-line pl-5 text-sm font-medium">{hotel.reviews[0].text}</p>
        )}
      </div>

      {hotel.nearby.length > 0 && (
        <section className="mt-6">
          <h2 className={titleClass}>Surroundings</h2>
          <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            {hotel.nearby.slice(0, LISTED_PLACE_COUNT).map((place) => (
              <li key={place.id} className="flex items-center gap-3">
                <Icon name={place.iconName} className="w-4" />
                {place.name} ({place.distance})
              </li>
            ))}
          </ul>
          <a href="#location" className={moreClass}>
            View on map
          </a>
        </section>
      )}

      <section className="mt-6">
        <h2 className={titleClass}>Amenities</h2>
        <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          {hotel.amenities.slice(0, LISTED_AMENITY_COUNT).map((amenity) => (
            <li key={amenity.id} className="flex items-center gap-3">
              <Icon name={amenity.iconName} className="w-4" />
              {amenity.label}
            </li>
          ))}
        </ul>
        <a href="#amenities" className={moreClass}>
          All amenities
        </a>
      </section>
    </div>
  );
};

export default HotelOverview;
