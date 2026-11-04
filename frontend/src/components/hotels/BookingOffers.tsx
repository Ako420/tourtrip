import { authLinks, bookingOffers } from "@/constants";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

const BookingOffers = () => {
  return (
    <section aria-label="Booking offers" className="flex flex-wrap items-center gap-3 rounded-card border border-line p-4">
      <p className="font-semibold">First booking offer</p>
      <ul className="flex flex-wrap gap-2 text-sm">
        {bookingOffers.map((offer) => (
          <li key={offer.id} className="flex items-center gap-2 rounded-md border border-promo-soft px-2.5 py-1.5">
            <Icon name={offer.iconName} className="text-promo" />
            <span className="font-semibold">{offer.label}</span>
            <span className="text-muted">{offer.detail}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href={authLinks.login} size="sm" className="ml-auto">
        Claim all
      </ButtonLink>
    </section>
  );
};

export default BookingOffers;
