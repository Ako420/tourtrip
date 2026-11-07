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
        <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-surface-alt lg:aspect-auto lg:h-142">
          <AppImage src={section.imageUrl} alt="Traveler waiting at an airport gate" fill sizes="(min-width: 1024px) 45rem, 100vw" className="object-cover" />
          <p className="absolute top-11 left-4 rounded-sm bg-white/30 px-2 py-1 text-xl font-bold text-white sm:text-2xl">
            {section.caption}
          </p>
        </div>

        <div className="relative flex h-64 items-end justify-center overflow-hidden rounded-card border border-line bg-surface p-6 lg:h-142">
          <AppImage src={section.mapImageUrl} alt="" fill sizes="(min-width: 1024px) 26rem, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-surface/70" />
          <ButtonLink href={section.ctaHref} className="relative">
            {section.ctaLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
