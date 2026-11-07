import Link from "next/link";
import type { CarCity, Section } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import Price from "../ui/Price";

type CarCitiesProps = {
  section: Section<CarCity>;
};

const CarCities = ({ section }: CarCitiesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <Carousel label="cities" slideClassName="w-56 lg:w-[calc((100%-3rem)/4)]">
        {section.items.map((city) => (
          <Link
            key={city.id}
            href={`/cars?location=${encodeURIComponent(city.name)}#search`}
            className="group relative block h-50 overflow-hidden rounded-card bg-primary-deep text-white"
          >
            <AppImage
              src={city.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 18rem, 14rem"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <span className="absolute bottom-3 left-4">
              <span className="block type-section">{city.name}</span>
              <span className="text-sm">From <Price amount={city.fromPrice} currency={city.currency} /> per day</span>
            </span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
};

export default CarCities;
