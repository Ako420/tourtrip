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

      <ul className="grid auto-rows-40 grid-cols-2 gap-4 lg:auto-rows-68 lg:grid-cols-6">
        {section.items.map((destination, index) => (
          <li key={destination.id} className={`relative ${index === 0 ? "col-span-2" : ""}`}>
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
              <span
                className={`absolute left-4 font-semibold ${
                  destination.links ? "bottom-14 text-2xl" : "bottom-4 text-xl"
                }`}
              >
                {destination.name}
              </span>
            </Link>

            {destination.links && (
              <ul className="scrollbar-none absolute inset-x-4 bottom-4 flex gap-2 overflow-x-auto">
                {destination.links.map((link) => (
                  <li key={link.href} className="shrink-0">
                    <Link
                      href={link.href}
                      className="block rounded-full border border-white px-3 py-1 text-xs text-white transition-colors duration-300 ease-out hover:bg-white hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TrendingDestinations;
