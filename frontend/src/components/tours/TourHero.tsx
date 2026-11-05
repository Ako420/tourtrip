import Form from "next/form";
import Link from "next/link";
import { tourPaths } from "@/constants";
import type { ToursContent, TourType } from "@/types";
import AppImage from "../ui/AppImage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type TourHeroProps = {
  type: TourType;
  content: ToursContent;
  query?: string;
};

const TourHero = ({ type, content, query }: TourHeroProps) => {
  const path = tourPaths[type];

  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <AppImage src={content.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/20" />

      <div className="relative mx-auto max-w-content">
        <h1 className="text-3xl font-bold sm:text-5xl">
          {content.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-5 text-sm text-white/90">{content.subtitle}</p>

        <Form
          action={path}
          scroll={false}
          role="search"
          className="flex flex-col gap-3 rounded-panel bg-surface p-4 text-ink shadow-card sm:flex-row sm:items-center"
        >
          <label className="flex h-14 min-w-0 items-center gap-3 rounded-card border border-line px-4 sm:flex-1">
            <Icon name="location" className="text-ink-soft" />
            <span className="sr-only">Where do you want to visit?</span>
            <input
              key={query}
              name="q"
              defaultValue={query}
              placeholder="Where do you want to visit?"
              className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
            />
          </label>
          <Button type="submit" size="lg" className="sm:px-10">
            <Icon name="search" />
            Search
          </Button>
        </Form>

        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">Popular:</span>
          {content.popular.map((place) => (
            <Link
              key={place}
              href={`${path}?q=${encodeURIComponent(place)}`}
              scroll={false}
              className="rounded-md bg-ink/40 px-2.5 py-1 transition-colors duration-300 ease-out hover:bg-ink/70"
            >
              {place}
            </Link>
          ))}
        </p>
      </div>
    </section>
  );
};

export default TourHero;
