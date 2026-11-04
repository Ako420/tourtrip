import Link from "next/link";
import type { CarTypeTile, Section } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";

type CarTypesProps = {
  section: Section<CarTypeTile>;
};

const CarTypes = ({ section }: CarTypesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <Carousel label="car types" slideClassName="w-44 sm:w-56 lg:w-[calc((100%-3rem)/4)]">
        {section.items.map((type) => (
          <Link
            key={type.id}
            href={`/cars?type=${type.id}#search`}
            className="group block overflow-hidden rounded-card border border-line transition-shadow duration-300 ease-out hover:shadow-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-alt">
              <AppImage
                src={type.imageUrl}
                alt={`${type.label} car`}
                fill
                sizes="(min-width: 1024px) 18rem, 11rem"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold transition-colors duration-300 ease-out group-hover:text-primary">{type.label}</h3>
              <p className="text-sm text-muted">{type.detail}</p>
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  );
};

export default CarTypes;
