import type { TrainsContent, TrainSearch } from "@/types";
import AppImage from "../ui/AppImage";
import TrainSearchForm from "./TrainSearchForm";

type TrainHeroProps = {
  hero: TrainsContent["hero"];
  search: TrainSearch;
  stations: string[];
};

const TrainHero = ({ hero, search, stations }: TrainHeroProps) => {
  return (
    <section id="search" className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/15" />

      <div className="relative mx-auto max-w-content">
        <h1 className="type-hero font-bold">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-5 text-white/90">{hero.subtitle}</p>
        <TrainSearchForm initialValues={search} stations={stations} />
      </div>
    </section>
  );
};

export default TrainHero;
