import type { FlightsContent } from "@/types";
import AppImage from "../ui/AppImage";
import ButtonLink from "../ui/ButtonLink";
import SectionHeading from "../ui/SectionHeading";

type TrendingSectionProps = {
  section: FlightsContent["trending"];
};

const TrendingSection = ({ section }: TrendingSectionProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-surface-alt lg:aspect-auto lg:h-[26rem]">
          <AppImage src={section.imageUrl} alt="Traveler waiting at an airport gate" fill sizes="(min-width: 1024px) 45rem, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-ink/75 to-transparent p-5 pb-16">
            <p className="text-xl font-bold text-white sm:text-2xl">{section.caption}</p>
          </div>
        </div>

        <div className="relative flex h-64 items-end justify-center overflow-hidden rounded-card bg-primary-soft p-6 lg:h-[26rem]">
          <AppImage src={section.mapImageUrl} alt="" fill sizes="(min-width: 1024px) 26rem, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-primary-soft/55" />
          <ButtonLink href={section.ctaHref} className="relative">
            {section.ctaLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
