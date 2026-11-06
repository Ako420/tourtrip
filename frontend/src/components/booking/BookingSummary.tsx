import { formatCount, formatPrice, formatShortDate, getRatingLabel, getStayTotal, nightsBetween } from "@/lib";
import type { HotelDetails, HotelRoom, HotelSearch } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import StarRating from "../ui/StarRating";
import ChargeNotice from "./ChargeNotice";

type BookingSummaryProps = {
  hotel: HotelDetails;
  room: HotelRoom;
  search: HotelSearch;
};

const cardClass = "rounded-card border border-line p-4";

const BookingSummary = ({ hotel, room, search }: BookingSummaryProps) => {
  const nights = nightsBetween(search.checkIn ?? "", search.checkOut ?? "");
  const total = formatPrice(getStayTotal(room, search), hotel.currency);
  const cancellation = hotel.policies.find((policy) => policy.id === "cancellation");
  const guests = [formatCount(search.adults, "adult")];

  if (search.children > 0) {
    guests.push(formatCount(search.children, "child", "children"));
  }

  return (
    <aside aria-label="Booking summary" className="flex flex-col gap-3">
      <div className={cardClass}>
        <div className="flex items-start gap-3 border-b border-line pb-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-surface-alt">
            <AppImage src={hotel.imageUrl} alt="" fill sizes="6rem" className="object-cover" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-bold">{hotel.name}</h2>
            <StarRating stars={hotel.stars} />
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
              <span className="rounded-md bg-primary-deep px-1.5 font-bold text-white">{hotel.rating.toFixed(1)}/10</span>
              <span className="font-medium text-primary">{getRatingLabel(hotel.rating)}</span>
              {formatCount(hotel.reviewCount, "review")}
            </p>
          </div>
        </div>

        <h3 className="mt-4 text-xl font-bold">{room.name}</h3>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Icon name="users" className="w-4" />
            {guests.join(", ")} · {room.beds}
          </li>
          {room.breakfastIncluded && (
            <li className="flex items-center gap-2">
              <Icon name="restaurant" className="w-4" />
              Breakfast included
            </li>
          )}
          <li className="flex items-center gap-2">
            <Icon name="info" className="w-4" />
            {room.freeCancellation ? "Free cancellation" : "Non-refundable"}
          </li>
        </ul>
      </div>

      <div className={cardClass}>
        <h2 className="text-xl font-bold">
          {formatShortDate(search.checkIn ?? "")} - {formatShortDate(search.checkOut ?? "")}
        </h2>
        <p className="mt-3 flex gap-6 border-t border-line pt-3 text-sm">
          <span className="flex items-center gap-2">
            <Icon name="calendar" />
            {formatCount(nights, "night")}
          </span>
          <span className="flex items-center gap-2">
            <Icon name="bed" />
            {formatCount(search.rooms, "room")}
          </span>
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-xl font-bold">Price details</h2>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt>
              {formatCount(search.rooms, "room")} × {formatCount(nights, "night")}
            </dt>
            <dd>{total}</dd>
          </div>
          <div className="flex justify-between gap-4 text-ink-soft">
            <dt className="ml-3">{formatPrice(room.pricePerNight, hotel.currency)} per night</dt>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Taxes and fees</dt>
            <dd>Included</dd>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <dt className="text-2xl font-bold">Total</dt>
            <dd className="text-2xl font-bold">{total}</dd>
          </div>
        </dl>
        <ChargeNotice />
      </div>

      <div className={cardClass}>
        <h2 className="text-xl font-bold">Cancellation policy</h2>
        <p className="mt-2 text-sm">
          {cancellation?.description ?? (room.freeCancellation ? "Free cancellation" : "This room cannot be cancelled.")}
        </p>
      </div>
    </aside>
  );
};

export default BookingSummary;
