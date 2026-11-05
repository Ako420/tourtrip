import type { HotelsContent } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type HotelOfferBannerProps = {
  offer: HotelsContent["offer"];
};

const HotelOfferBanner = ({ offer }: HotelOfferBannerProps) => {
  return (
    <section className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-5 rounded-card border border-line bg-primary-soft/50 p-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">{offer.title}</h2>
        <ul className="mt-2 flex flex-col gap-2 text-sm">
          {offer.points.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <Icon name="check" className="text-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink href={offer.ctaHref}>{offer.ctaLabel}</ButtonLink>
    </section>
  );
};

export default HotelOfferBanner;
