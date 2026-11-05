import type { PackagesContent, PackageSearch } from "@/types";
import AppImage from "../ui/AppImage";
import PackageSearchForm from "./PackageSearchForm";

type PackageHeroProps = {
  hero: PackagesContent["hero"];
  search: PackageSearch;
  airports: string[];
  destinations: string[];
};

const PackageHero = ({ hero, search, airports, destinations }: PackageHeroProps) => {
  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/30 to-ink/10" />

      <div className="relative mx-auto max-w-content">
        <h1 className="text-3xl font-bold sm:text-5xl">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-5 text-sm text-white/90">{hero.subtitle}</p>
        <PackageSearchForm initialValues={search} airports={airports} destinations={destinations} />
      </div>
    </section>
  );
};

export default PackageHero;
