import type { IconName } from "@/constants";
import { formatCount, formatPrice } from "@/lib";
import AppImage from "./AppImage";
import ButtonLink from "./ButtonLink";
import Icon from "./Icon";

type TripHeaderProps = {
  name: string;
  imageUrl: string;
  summary: string;
  facts: { iconName: IconName; label: string }[];
  rating: number;
  reviewCount: number;
  price: number | string;
  currency: string;
};

const TripHeader = ({ name, imageUrl, summary, facts, rating, reviewCount, price, currency }: TripHeaderProps) => {
  return (
    <>
      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-panel bg-surface-alt sm:aspect-[21/9]">
        <AppImage src={imageUrl} alt={name} fill priority sizes="100vw" className="object-cover" />
      </div>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            {facts.map((fact) => (
              <span key={fact.label} className="flex items-center gap-1.5">
                <Icon name={fact.iconName} />
                {fact.label}
              </span>
            ))}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded-md bg-primary px-1.5 py-0.5 font-semibold text-white">{rating.toFixed(1)}/5</span>
            <span className="text-muted">{formatCount(reviewCount, "review")}</span>
          </p>
          <p className="mt-3 max-w-2xl text-ink-soft">{summary}</p>
        </div>

        <div className="flex w-full items-center justify-between gap-4 rounded-card border border-line p-4 sm:w-auto sm:flex-col sm:items-stretch sm:text-right">
          <p className="text-sm text-muted">
            From <span className="block text-2xl font-bold text-primary">{formatPrice(price, currency)}</span>
            per person
          </p>
          <ButtonLink href="#enquire">Enquire now</ButtonLink>
        </div>
      </header>
    </>
  );
};

export default TripHeader;
