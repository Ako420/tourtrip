import { nightsBetween, toSearchQuery } from "@/lib";
import type { HotelDetails, HotelSearch } from "@/types";
import RoomCard from "./RoomCard";
import StayBar from "./StayBar";

type HotelRoomsProps = {
  hotel: HotelDetails;
  search: HotelSearch;
};

const HotelRooms = ({ hotel, search }: HotelRoomsProps) => {
  const nights = search.checkIn && search.checkOut ? nightsBetween(search.checkIn, search.checkOut) : 0;

  return (
    <section id="rooms" className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-xl font-bold">Choose your room</h2>
      <StayBar key={toSearchQuery(search)} slug={hotel.slug} search={search} />
      {nights === 0 && <p className="mb-4 text-sm text-muted">Add your dates to see the total price.</p>}

      <ul className="flex flex-col gap-4">
        {hotel.rooms.map((room) => (
          <li key={room.id}>
            <RoomCard
              room={room}
              currency={hotel.currency}
              bookHref={`/hotels/${hotel.slug}/book?${toSearchQuery({ ...search, destination: undefined })}&room=${room.id}`}
              nights={nights}
              roomCount={search.rooms}
              guestCount={search.adults + search.children}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HotelRooms;
