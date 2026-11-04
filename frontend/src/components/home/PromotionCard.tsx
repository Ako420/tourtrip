import type { Promotion } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type PromotionCardProps = {
  promotion: Promotion;
};

const PromotionCard = ({ promotion }: PromotionCardProps) => {
  return (
    <article className="flex h-full justify-between overflow-hidden rounded-card border border-promo-soft bg-surface">
      <div className="flex flex-col p-4">
        <h3 className="text-xl font-bold">{promotion.title}</h3>
        <p className="mt-1 flex items-center gap-2 text-ink-soft" title={promotion.terms}>
          {promotion.subtitle}
          <Icon name="info" className="text-xs text-muted" />
        </p>
        <ButtonLink href={promotion.ctaHref} size="sm" className="mt-auto self-start">
          {promotion.ctaLabel}
        </ButtonLink>
      </div>
      <div className="relative flex w-16 shrink-0 items-center justify-center border-l border-dashed border-promo-soft text-2xl text-promo">
        <span className="absolute -top-1.5 -left-1.5 size-3 rounded-full border border-promo-soft bg-surface" />
        <span className="absolute -bottom-1.5 -left-1.5 size-3 rounded-full border border-promo-soft bg-surface" />
        <Icon name={promotion.iconName} />
      </div>
    </article>
  );
};

export default PromotionCard;
