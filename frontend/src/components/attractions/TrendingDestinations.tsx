import Link from "next/link";
import type { Section, TrendingDestination } from "@/types";
import AppImage from "../ui/AppImage";
import SectionHeading from "../ui/SectionHeading";

type TrendingDestinationsProps = {
  section: Section<TrendingDestination>;
};

const TrendingDestinations = ({ section }: TrendingDestinationsProps) => {
  return (
    <section className="mx-auto max-w-content">
      <SectionHeading>{section.title}</SectionHeading>

      <ul className="grid auto-rows-36 grid-cols-2 gap-4 lg:auto-rows-44 lg:grid-cols-6">
        {section.items.map((destination, index) => (
          <li key={destination.id} className={index === 0 ? "col-span-2" : ""}>
            <Link
              href={`/attractions?q=${encodeURIComponent(destination.name)}#results`}
              className="group relative block h-full overflow-hidden rounded-card bg-primary-deep text-white"
            >
              <AppImage
                src={destination.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-3 left-4 text-lg font-bold">{destination.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrendingDestinations;
