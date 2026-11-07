import type { AttractionDetails } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";
import Price from "../ui/Price";

type AttractionBookCardProps = {
  attraction: AttractionDetails;
};

const AttractionBookCard = ({ attraction }: AttractionBookCardProps) => {
  return (
    <div className="rounded-card bg-surface p-5 lg:sticky lg:top-32">
      <h2 className="font-bold">{attraction.tickets[0]?.name ?? attraction.name}</h2>
      {attraction.freeCancellation && (
        <p className="mt-2 flex items-center gap-2 rounded-md bg-primary-soft px-2 py-1 text-sm text-success">
          <Icon name="check" />
          Free cancellation
        </p>
      )}
      <p className="mt-3 text-right text-sm text-ink-soft">
        From{" "}
        <span className="text-xl font-bold text-primary">
          <Price amount={attraction.price} currency={attraction.currency} />
        </span>{" "}
        per adult
      </p>
      <ButtonLink href="#tickets" size="lg" className="mt-3 w-full">
        See tickets
      </ButtonLink>
    </div>
  );
};

export default AttractionBookCard;
