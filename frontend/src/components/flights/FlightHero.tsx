import Link from "next/link";
import type { FlightsContent, FlightSearch } from "@/types";
import AppImage from "../ui/AppImage";
import Icon from "../ui/Icon";
import FlightSearchForm from "./FlightSearchForm";

type FlightHeroProps = {
  hero: FlightsContent["hero"];
  quickLinks: FlightsContent["quickLinks"];
  search: FlightSearch;
  airports: string[];
};

const FlightHero = ({ hero, quickLinks, search, airports }: FlightHeroProps) => {
  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/25 to-ink/10" />

      <div className="relative mx-auto max-w-content">
        <h1 className="type-title font-bold">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-5 text-sm text-white/90">{hero.subtitle}</p>
        <FlightSearchForm initialValues={search} airports={airports} />
      </div>

      <ul className="absolute top-32 right-6 hidden flex-col gap-3 2xl:flex">
        {quickLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className="flex size-10 items-center justify-center rounded-md bg-surface text-primary-deep shadow-card transition-transform duration-200 hover:scale-105"
            >
              {link.iconName && <Icon name={link.iconName} />}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FlightHero;
