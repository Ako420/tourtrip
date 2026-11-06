import { authLinks, bookingOffers } from "@/constants";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

const BookingOffers = () => {
  return (
    <section aria-label="Free account" className="rounded-card border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">Join Hotel Jr for free</p>
        <ButtonLink href={authLinks.signup} size="sm">
          Create an account
        </ButtonLink>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2 text-sm">
        {bookingOffers.map((offer) => (
          <li key={offer.id} className="flex items-center gap-2 rounded-md border border-primary-soft px-2.5 py-1.5">
            <Icon name={offer.iconName} className="text-primary" />
            <span className="font-semibold">{offer.label}</span>
            <span className="text-xs text-muted">{offer.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BookingOffers;
