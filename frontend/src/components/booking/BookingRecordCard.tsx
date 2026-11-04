import Link from "next/link";
import type { IconName } from "@/constants";
import { formatPrice, formatShortDate } from "@/lib";
import type { BookingRecord } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";

type BookingRecordCardProps = {
  booking: BookingRecord;
};

const typeDetails: Record<BookingRecord["type"], { label: string; iconName: IconName }> = {
  hotel: { label: "Hotel", iconName: "bed" },
  flight: { label: "Flight", iconName: "plane" },
  attraction: { label: "Attraction", iconName: "ticket" },
  car: { label: "Car rental", iconName: "car" },
  train: { label: "Train", iconName: "train" },
};

const statusDetails: Record<BookingRecord["status"], { label: string; className: string }> = {
  confirmed: { label: "Confirmed", className: "bg-primary-soft text-primary" },
  completed: { label: "Completed", className: "bg-surface-alt text-ink-soft" },
  cancelled: { label: "Cancelled", className: "bg-promo-soft text-promo" },
};

const BookingRecordCard = ({ booking }: BookingRecordCardProps) => {
  const type = typeDetails[booking.type];
  const status = statusDetails[booking.status];

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line sm:flex-row">
      <div className="relative aspect-[16/9] shrink-0 bg-surface-alt sm:aspect-auto sm:w-52">
        <AppImage src={booking.imageUrl} alt="" fill sizes="(min-width: 640px) 13rem, 100vw" className="object-cover" />
      </div>

      <div className="min-w-0 flex-1 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <Icon name={type.iconName} />
            {type.label}
          </p>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>{status.label}</span>
        </div>

        <h2 className="mt-1 text-lg font-semibold">{booking.title}</h2>
        <p className="text-sm text-muted">{booking.subtitle}</p>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Reference</dt>
            <dd className="font-semibold">{booking.reference}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Dates</dt>
            <dd className="font-medium">
              {formatShortDate(booking.startDate)}
              {booking.endDate && ` - ${formatShortDate(booking.endDate)}`}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Travelers</dt>
            <dd className="font-medium">{booking.guests}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Total</dt>
            <dd className="font-semibold text-primary">{formatPrice(booking.total, booking.currency)}</dd>
          </div>
        </dl>

        <Link href={booking.href} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          View {type.label.toLowerCase()} details
        </Link>
      </div>
    </article>
  );
};

export default BookingRecordCard;
