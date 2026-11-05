import type { HotelsContent } from "@/types";
import SearchForm from "../search/SearchForm";
import AppImage from "../ui/AppImage";

type HotelsHeroProps = {
  hero: HotelsContent["hero"];
  destinations: string[];
};

const HotelsHero = ({ hero, destinations }: HotelsHeroProps) => {
  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-52 text-white">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-primary-deep/55" />

      <div className="relative mx-auto max-w-content">
        <h1 className="type-hero font-bold">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <div className="mt-4 rounded-card bg-surface p-4 text-ink shadow-card">
          <SearchForm destinations={destinations} />
        </div>
      </div>
    </section>
  );
};

export default HotelsHero;
