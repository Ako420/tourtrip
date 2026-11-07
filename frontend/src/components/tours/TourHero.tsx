import Form from "next/form";
import Link from "next/link";
import { tourPaths, tourTypeLabels } from "@/constants";
import type { ToursContent, TourType } from "@/types";
import AppImage from "../ui/AppImage";
import Button from "../ui/Button";
import ButtonLink from "../ui/ButtonLink";
import Icon from "../ui/Icon";

type TourHeroProps = {
  type: TourType;
  content: ToursContent;
  query?: string;
};

const tourTypes = Object.keys(tourPaths) as TourType[];

const TourHero = ({ type, content, query }: TourHeroProps) => {
  const path = tourPaths[type];

  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20">
      <AppImage src={content.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/20" />

      <div className="relative mx-auto max-w-content">
        <h1 className="type-hero font-bold">
          {content.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-4 text-lg">{content.subtitle}</p>

        <div className="rounded-panel bg-surface p-4 text-ink shadow-card">
          <nav aria-label="Tour types" className="mb-4 flex gap-6">
            {tourTypes.map((tourType) => (
              <Link
                key={tourType}
                href={tourPaths[tourType]}
                aria-current={tourType === type ? "page" : undefined}
                className={`border-b-2 pb-2 transition-colors duration-300 ease-out hover:text-primary ${
                  tourType === type ? "border-ink font-semibold" : "border-transparent text-ink-soft"
                }`}
              >
                {tourTypeLabels[tourType]}
              </Link>
            ))}
          </nav>

          <Form action={path} scroll={false} role="search" className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="block min-w-0 rounded-card border border-line px-4 py-2 sm:flex-1">
              <span className="block text-xs text-ink-soft">Where do you want to visit?</span>
              <input
                key={query}
                name="q"
                defaultValue={query}
                placeholder="Enter a destination or keyword"
                className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
              />
            </label>
            {content.customize && (
              <ButtonLink href={content.customize.href} variant="outline" size="lg">
                {content.customize.label}
              </ButtonLink>
            )}
            <Button type="submit" size="lg" className="sm:px-8">
              <Icon name="search" />
              Search
            </Button>
          </Form>

          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium">Popular:</span>
            {content.popular.map((place) => (
              <Link
                key={place}
                href={`${path}?q=${encodeURIComponent(place)}`}
                scroll={false}
                className="rounded-md bg-surface-alt px-3 py-1.5 transition-colors duration-300 ease-out hover:bg-primary-soft hover:text-primary"
              >
                {place}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TourHero;
