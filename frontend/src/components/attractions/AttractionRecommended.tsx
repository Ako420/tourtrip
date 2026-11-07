import Link from "next/link";
import type { Attraction, AttractionRow } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import Icon from "../ui/Icon";
import SectionHeading from "../ui/SectionHeading";
import AttractionCard from "./AttractionCard";

type AttractionRecommendedProps = {
  title: string;
  rows: (AttractionRow & { attractions: Attraction[] })[];
};

const AttractionRecommended = ({ title, rows }: AttractionRecommendedProps) => {
  return (
    <section id="results" className="mx-auto mt-12 max-w-content scroll-mt-4">
      <SectionHeading>{title}</SectionHeading>

      <div className="space-y-9">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-4 lg:grid-cols-[17.625rem_1fr]">
            <Link
              href={`/attractions?category=${row.category}#results`}
              className="group relative flex h-44 flex-col items-start justify-end overflow-hidden rounded-card bg-primary-deep p-5 text-white lg:h-auto"
            >
              <AppImage
                src={row.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 18rem, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="relative text-xl font-semibold">{row.title}</span>
              <span className="relative mt-3 flex items-center gap-2 rounded-md border border-white px-4 py-1.5 font-medium">
                Explore
                <Icon name="chevron-right" className="text-xs" />
              </span>
            </Link>

            <div className="min-w-0">
              <Carousel label={`${row.title} attractions`} slideClassName="w-64 lg:w-[calc((100%-2rem)/3)]">
                {row.attractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </Carousel>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AttractionRecommended;
