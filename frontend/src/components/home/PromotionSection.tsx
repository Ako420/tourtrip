import type { PromotionSection as PromotionSectionContent } from "@/types";
import ButtonLink from "../ui/ButtonLink";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import PromotionCard from "./PromotionCard";

type PromotionSectionProps = {
  section: PromotionSectionContent;
};

const PromotionSection = ({ section }: PromotionSectionProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <Carousel label="offers" slideClassName="h-40 w-64 lg:w-[calc((100%-3rem)/4)]">
        <div className="flex h-full flex-col justify-between rounded-card border border-promo-soft bg-promo-soft/40 p-4">
          <p className="font-semibold">{section.intro.title}</p>
          <ButtonLink href={section.intro.ctaHref} size="sm" className="self-start">
            {section.intro.ctaLabel}
          </ButtonLink>
        </div>
        {section.items.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </Carousel>
    </section>
  );
};

export default PromotionSection;
