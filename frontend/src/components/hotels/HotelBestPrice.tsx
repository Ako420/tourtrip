import { formatCount, getLowestRoom, getStayTotal, nightsBetween } from "@/lib";
import type { HotelDetails, HotelSearch } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type HotelBestPriceProps = {
  hotel: HotelDetails;
  search: HotelSearch;
};

const HotelBestPrice = ({ hotel, search }: HotelBestPriceProps) => {
  const room = getLowestRoom(hotel);
  const nights = search.checkIn && search.checkOut ? nightsBetween(search.checkIn, search.checkOut) : 0;

  if (!room) {
    return <p className="self-start rounded-card bg-surface-alt p-5 font-medium">No rooms are available right now.</p>;
  }

  return (
    <aside className="self-start overflow-hidden rounded-card shadow-card lg:sticky lg:top-36">
      <h2 className="bg-primary-soft px-4 py-3 text-xl font-bold text-primary">Our lowest price</h2>

      <div className="p-4">
        <p className="type-price font-bold text-primary">
          <Price amount={room.pricePerNight} currency={hotel.currency} />
        </p>
        <p className="text-sm text-ink-soft">
          {nights > 0 ? (
            <>
              Total for {formatCount(nights, "night")}, {formatCount(search.rooms, "room")}:{" "}
              <Price amount={getStayTotal(room, search)} currency={hotel.currency} />
            </>
          ) : (
            "per night"
          )}
        </p>

        <h3 className="mt-4 font-medium">{room.name}</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center gap-3">
            <Icon name="bed" className="w-4" />
            {room.beds}
          </li>
          <li className="flex items-center gap-3">
            <Icon name="users" className="w-4" />
            Sleeps {room.maxGuests}
          </li>
          {room.breakfastIncluded && (
            <li className="flex items-center gap-3 text-success">
              <Icon name="restaurant" className="w-4" />
              Breakfast included
            </li>
          )}
          {room.freeCancellation && (
            <li className="flex items-center gap-3 text-success">
              <Icon name="check" className="w-4" />
              Free cancellation
            </li>
          )}
        </ul>

        <ButtonLink href="#rooms" size="lg" className="mt-4 w-full">
          More options
        </ButtonLink>
      </div>
    </aside>
  );
};

export default HotelBestPrice;
