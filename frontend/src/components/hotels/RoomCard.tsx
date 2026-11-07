import { formatCount } from "@/lib";
import type { HotelRoom } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

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
    <article
      className={`grid overflow-hidden rounded-card border border-line md:grid-cols-[19rem_minmax(0,1fr)] ${
        room.isAvailable ? "" : "opacity-70"
      }`}
    >
      <div className="p-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-surface-alt">
          <AppImage src={room.imageUrl} alt={room.name} fill sizes="(min-width: 768px) 18rem, 100vw" className="object-cover" />
        </div>
        <h3 className="mt-3 text-lg font-bold">{room.name}</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Icon name="bed" className="w-4" />
            {room.beds}
          </li>
          <li className="flex items-center gap-2">
            <Icon name="expand" className="w-4" />
            <span>
              {room.sizeSqm} m<sup>2</sup>
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-line p-4 sm:flex-row md:border-t-0 md:border-l">
        <div>
          <p className="mb-2 text-sm font-medium">{room.breakfastIncluded ? "Breakfast included" : "Room only"}</p>
          <ul className="space-y-1.5 text-sm">
            {room.freeCancellation ? (
              <li className="flex items-center gap-2 text-success">
                <Icon name="check" />
                Free cancellation
              </li>
            ) : (
              <li>Non-refundable</li>
            )}
            <li className="flex items-center gap-2">
              <Icon name="users" className="w-4" />
              Sleeps {room.maxGuests}
            </li>
          </ul>
          {isTooSmall && room.isAvailable && (
            <p className="mt-2 text-sm text-accent">Too small for {formatCount(guestCount, "guest")}. Add a room.</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col justify-end gap-2 sm:w-52">
          <p className="type-price font-bold text-primary">
            <Price amount={room.pricePerNight} currency={currency} />
          </p>
          <p className="-mt-2 text-xs text-ink-soft">
            {nights > 0 ? (
              <>
                Total for {formatCount(nights, "night")}, {formatCount(roomCount, "room")}:{" "}
                <span className="font-bold">
                  <Price amount={Number(room.pricePerNight) * nights * roomCount} currency={currency} />
                </span>
              </>
            ) : (
              "per night"
            )}
          </p>
          {room.isAvailable ? (
            <ButtonLink href={bookHref} className="w-full">
              Reserve
            </ButtonLink>
          ) : (
            <p className="font-medium text-muted">Sold out</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
