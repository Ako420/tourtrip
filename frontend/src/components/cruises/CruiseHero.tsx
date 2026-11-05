import Form from "next/form";
import { cruisesPath } from "@/constants";
import type { CruiseFilters, CruisesContent } from "@/types";
import AppImage from "../ui/AppImage";
import Button from "../ui/Button";
import Icon from "../ui/Icon";

type CruiseHeroProps = {
  content: CruisesContent;
  filters: CruiseFilters;
};

const CruiseHero = ({ content, filters }: CruiseHeroProps) => {
  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-20 xl:pt-24">
      <AppImage src={content.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/20" />

      <div className="relative mx-auto max-w-content">
        <h1 className="type-hero font-bold">
          {content.title}
          <span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-5 text-sm text-white/90">{content.subtitle}</p>

        <Form
          action={cruisesPath}
          scroll={false}
          role="search"
          className="grid gap-3 rounded-panel bg-surface p-4 text-ink shadow-card md:grid-cols-[1fr_18rem_auto]"
        >
          <label className="flex h-14 min-w-0 items-center gap-3 rounded-card border border-line px-4">
            <Icon name="location" className="text-ink-soft" />
            <span className="sr-only">Destination or cruise</span>
            <input
              key={filters.query}
              name="q"
              defaultValue={filters.query}
              placeholder="Destination or cruise"
              className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
            />
          </label>
          <label className="flex h-14 min-w-0 items-center gap-3 rounded-card border border-line px-4 text-sm">
            <span className="shrink-0 text-muted">Leaving from</span>
            <input
              key={filters.date}
              type="date"
              name="date"
              aria-label="Departure date"
              defaultValue={filters.date}
              className="w-full min-w-0 bg-transparent font-medium outline-none"
            />
          </label>
          <Button type="submit" size="lg" className="md:px-8">
            <Icon name="search" />
            Search
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default CruiseHero;
