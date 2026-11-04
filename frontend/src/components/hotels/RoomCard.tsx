import { formatCount, formatPrice } from "@/lib";
import type { HotelRoom } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type RoomCardProps = {
  room: HotelRoom;
  currency: string;
  bookHref: string;
  nights: number;
  roomCount: number;
  guestCount: number;
};

const RoomCard = ({ room, currency, bookHref, nights, roomCount, guestCount }: RoomCardProps) => {
  const isTooSmall = guestCount > room.maxGuests * roomCount;

  return (
    <article className={`flex flex-col overflow-hidden rounded-card border border-line sm:flex-row ${room.isAvailable ? "" : "opacity-70"}`}>
      <div className="relative aspect-[16/9] shrink-0 bg-surface-alt sm:aspect-auto sm:w-52">
        <AppImage src={room.imageUrl} alt={room.name} fill sizes="(min-width: 640px) 13rem, 100vw" className="object-cover" />
      </div>

      <div className="flex-1 p-4">
        <h3 className="font-semibold">{room.name}</h3>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <li className="flex items-center gap-1.5">
            <Icon name="bed" />
            {room.beds}
          </li>
          <li className="flex items-center gap-1.5">
            <Icon name="users" />
            Sleeps {room.maxGuests}
          </li>
          <li>
            {room.sizeSqm} m<sup>2</sup>
          </li>
        </ul>
        <ul className="mt-2 text-sm text-success">
          {room.freeCancellation && <li>Free cancellation</li>}
          {room.breakfastIncluded && <li>Breakfast included</li>}
        </ul>
        {isTooSmall && room.isAvailable && (
          <p className="mt-2 text-sm text-accent">Too small for {formatCount(guestCount, "guest")}. Add a room.</p>
        )}
      </div>

      <div className="flex shrink-0 flex-col justify-between gap-3 border-t border-line p-4 sm:w-48 sm:border-t-0 sm:border-l sm:text-right">
        <div>
          <p className="text-2xl font-bold text-primary">{formatPrice(room.pricePerNight, currency)}</p>
          <p className="text-xs text-muted">per night</p>
          {nights > 0 && (
            <p className="text-xs text-muted">
              {formatPrice(Number(room.pricePerNight) * nights * roomCount, currency)} total for{" "}
              {formatCount(nights, "night")}, {formatCount(roomCount, "room")}
            </p>
          )}
        </div>
        {room.isAvailable ? (
          <ButtonLink href={bookHref} size="sm" className="w-full">
            Reserve
          </ButtonLink>
        ) : (
          <p className="font-medium text-muted">Sold out</p>
        )}
      </div>
    </article>
  );
};

export default RoomCard;
