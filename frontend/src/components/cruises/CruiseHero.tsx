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

const fieldClass = "block min-w-0 rounded-card border border-line px-4 py-2.5";
const labelClass = "block text-sm";

const CruiseHero = ({ content, filters }: CruiseHeroProps) => {
  return (
    <section className="relative bg-primary-deep px-4 pt-32 pb-16 text-white sm:pb-32">
      <AppImage src={content.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink/20" />

      <div className="relative mx-auto max-w-content">
        <h1 className="mb-5 type-hero font-bold">
          {content.title}
          <span className="text-accent">.</span>
        </h1>

        <Form
          action={cruisesPath}
          scroll={false}
          role="search"
          className="grid gap-3 rounded-panel bg-surface p-4 text-ink shadow-card md:grid-cols-[1fr_20rem_auto]"
        >
          <label className={fieldClass}>
            <span className={labelClass}>Destination/cruise</span>
            <input
              key={filters.query}
              name="q"
              defaultValue={filters.query}
              placeholder="Search cruise name, cruise line or port"
              className="w-full min-w-0 bg-transparent font-medium outline-none placeholder:text-muted"
            />
          </label>
          <label className={fieldClass}>
            <span className={labelClass}>Departure date</span>
            <input
              key={filters.date}
              type="date"
              name="date"
              defaultValue={filters.date}
              className="w-full min-w-0 bg-transparent font-medium outline-none"
            />
          </label>
          <Button type="submit" size="lg" className="text-xl md:h-auto md:px-8">
            <Icon name="search" />
            Search
          </Button>
        </Form>
      </div>
    </section>
  );
};

export default CruiseHero;
