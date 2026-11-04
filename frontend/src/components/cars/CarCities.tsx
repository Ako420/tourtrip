import Link from "next/link";
import { formatPrice } from "@/lib";
import type { CarCity, Section } from "@/types";
import AppImage from "../ui/AppImage";
import SectionHeading from "../ui/SectionHeading";

type CarCitiesProps = {
  section: Section<CarCity>;
};

const CarCities = ({ section }: CarCitiesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {section.items.map((city) => (
          <li key={city.id}>
            <Link
              href={`/cars?location=${encodeURIComponent(city.name)}#search`}
              className="group relative block h-32 overflow-hidden rounded-card bg-primary-deep text-white sm:h-40"
            >
              <AppImage
                src={city.imageUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-3 left-3">
                <span className="block text-lg font-bold">{city.name}</span>
                <span className="text-xs">From {formatPrice(city.fromPrice, city.currency)} per day</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CarCities;
