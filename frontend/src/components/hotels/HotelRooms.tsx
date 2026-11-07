"use client";

import { useState } from "react";
import { nightsBetween, toSearchQuery } from "@/lib";
import type { HotelDetails, HotelSearch } from "@/types";
import RoomCard from "./RoomCard";
import StayBar from "./StayBar";

type HotelRoomsProps = {
  hotel: HotelDetails;
  search: HotelSearch;
};

const roomFilters = [
  { id: "breakfast", label: "Breakfast included", matches: (room: HotelDetails["rooms"][number]) => room.breakfastIncluded },
  { id: "cancellation", label: "Free cancellation", matches: (room: HotelDetails["rooms"][number]) => room.freeCancellation },
];

const HotelRooms = ({ hotel, search }: HotelRoomsProps) => {
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const nights = search.checkIn && search.checkOut ? nightsBetween(search.checkIn, search.checkOut) : 0;
  const activeFilters = roomFilters.filter((filter) => activeIds.includes(filter.id));
  const visibleRooms = hotel.rooms.filter((room) => activeFilters.every((filter) => filter.matches(room)));

  const toggle = (id: string) => {
    setActiveIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <section id="rooms" className="mt-10 scroll-mt-32">
      <h2 className="mb-4 text-2xl font-bold">Choose your room</h2>
      <StayBar key={toSearchQuery(search)} slug={hotel.slug} search={search} />
      {nights === 0 && <p className="mb-4 text-sm text-muted">Add your dates to see the total price.</p>}

      <div className="mb-4 flex flex-wrap gap-2">
        {roomFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={activeIds.includes(filter.id)}
            onClick={() => toggle(filter.id)}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-300 ease-out ${
              activeIds.includes(filter.id) ? "border-primary bg-primary-soft text-primary" : "border-line hover:border-primary"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleRooms.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {visibleRooms.map((room) => (
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
      ) : (
        <p className="rounded-card border border-line p-5 text-sm text-muted">No rooms match these options.</p>
      )}
    </section>
  );
};

export default HotelRooms;
