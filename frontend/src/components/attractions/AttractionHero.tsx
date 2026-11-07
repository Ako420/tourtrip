import Link from "next/link";
import type { AttractionsContent } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import AttractionSearch from "./AttractionSearch";

type AttractionHeroProps = {
  hero: AttractionsContent["hero"];
  quickSearches: string[];
  query?: string;
};

const AttractionHero = ({ hero, quickSearches, query }: AttractionHeroProps) => {
  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-20 text-white">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/30 to-ink/20" />

      <div className="relative mx-auto max-w-content">
        <h1 className="type-hero font-bold">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-4 text-lg sm:text-xl">{hero.subtitle}</p>

        <div className="rounded-panel bg-surface p-4 text-ink shadow-card">
          <AttractionSearch key={query} initialQuery={query} />

          <ul className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
            {quickSearches.map((search, index) => (
              <li key={search} className="shrink-0">
                <Link
                  href={`/attractions?q=${encodeURIComponent(search)}#results`}
                  className="flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-2 text-sm transition-colors duration-300 ease-out hover:bg-primary-soft hover:text-primary"
                >
                  {index === 0 && <Icon name="location" className="text-xs" />}
                  {search}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AttractionHero;
