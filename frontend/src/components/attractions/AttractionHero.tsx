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
    <section className="relative bg-primary-deep px-4 pt-32 pb-20 text-white xl:pt-28">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/30 to-ink/20" />

      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-5xl">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-6 text-white/90">{hero.subtitle}</p>
        <AttractionSearch key={query} initialQuery={query} />

        <ul className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
          {quickSearches.map((search) => (
            <li key={search} className="shrink-0">
              <Link
                href={`/attractions?q=${encodeURIComponent(search)}#results`}
                className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm text-ink transition-colors duration-300 ease-out hover:bg-primary-soft"
              >
                <Icon name="location" className="text-xs text-ink-soft" />
                {search}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AttractionHero;
