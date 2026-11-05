import type { CarCategory, CarSearch, CarsContent } from "@/types";
import AppImage from "../ui/AppImage";
import CarSearchForm from "./CarSearchForm";

type CarHeroProps = {
  hero: CarsContent["hero"];
  search: CarSearch;
  locations: string[];
  preselectedType?: CarCategory;
};

const CarHero = ({ hero, search, locations, preselectedType }: CarHeroProps) => {
  return (
    <section id="search" className="relative scroll-mt-0 bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <AppImage src={hero.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/30 to-ink/10" />

      <div className="relative mx-auto max-w-content">
        <h1 className="mb-5 type-hero font-bold">
          {hero.title}
          <span className="text-accent">.</span>
        </h1>
        <CarSearchForm initialValues={search} locations={locations} preselectedType={preselectedType} />
      </div>
    </section>
  );
};

export default CarHero;
