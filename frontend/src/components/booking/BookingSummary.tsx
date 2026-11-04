import { formatCount, formatPrice, formatShortDate, getStayTotal, nightsBetween } from "@/lib";
import type { HotelDetails, HotelRoom, HotelSearch } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";

type BookingSummaryProps = {
  hotel: HotelDetails;
  room: HotelRoom;
  search: HotelSearch;
};

const BookingSummary = ({ hotel, room, search }: BookingSummaryProps) => {
  const nights = nightsBetween(search.checkIn ?? "", search.checkOut ?? "");
  const guests = [formatCount(search.adults, "adult")];

  if (search.children > 0) {
    guests.push(formatCount(search.children, "child", "children"));
  }

  return (
    <aside aria-label="Booking summary" className="overflow-hidden rounded-card border border-line lg:sticky lg:top-24">
      <div className="relative aspect-[16/9] bg-surface-alt">
        <AppImage src={room.imageUrl} alt={room.name} fill sizes="(min-width: 1024px) 22rem, 100vw" className="object-cover" />
      </div>

      <div className="p-4">
        <StarRating stars={hotel.stars} />
        <h2 className="font-semibold">{hotel.name}</h2>
        <p className="text-sm text-muted">
          {hotel.area}, {hotel.city}
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-muted">Check-in</dt>
            <dd className="font-medium">{formatShortDate(search.checkIn ?? "")}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Check-out</dt>
            <dd className="font-medium">{formatShortDate(search.checkOut ?? "")}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-muted">Room</dt>
            <dd className="font-medium">
              {search.rooms} x {room.name}
            </dd>
            <dd className="text-muted">
              {room.beds} · {guests.join(", ")}
            </dd>
          </div>
        </dl>

        {(room.freeCancellation || room.breakfastIncluded) && (
          <ul className="mt-3 flex flex-col gap-1 text-sm text-success">
            {room.freeCancellation && (
              <li className="flex items-center gap-2">
                <Icon name="check" />
                Free cancellation
              </li>
            )}
            {room.breakfastIncluded && (
              <li className="flex items-center gap-2">
                <Icon name="check" />
                Breakfast included
              </li>
            )}
          </ul>
        )}

        <dl className="mt-3 flex flex-col gap-1 border-t border-line pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">
              {formatPrice(room.pricePerNight, hotel.currency)} x {formatCount(nights, "night")} x{" "}
              {formatCount(search.rooms, "room")}
            </dt>
            <dd>{formatPrice(getStayTotal(room, search), hotel.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Taxes and fees</dt>
            <dd>Included</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-2">
            <dt className="font-semibold">Total</dt>
            <dd className="text-2xl font-bold text-primary">{formatPrice(getStayTotal(room, search), hotel.currency)}</dd>
          </div>
        </dl>
      </div>
    </aside>
  );
};

export default BookingSummary;
