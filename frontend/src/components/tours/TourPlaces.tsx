import Link from "next/link";
import type { Section, TourPlace } from "@/types";
import AppImage from "../ui/AppImage";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";

type TourPlacesProps = {
  section: Section<TourPlace>;
};

const TourPlaces = ({ section }: TourPlacesProps) => {
  return (
    <section className="mx-auto mt-10 max-w-content first:mt-0">
      <SectionHeading>{section.title}</SectionHeading>

      <Carousel label="destinations" slideClassName="w-44 sm:w-52 lg:w-[calc((100%-4rem)/5)]">
        {section.items.map((place) => (
          <Link
            key={place.id}
            href={place.href}
            className="group relative block h-60 overflow-hidden rounded-card bg-primary-deep text-white lg:h-75"
          >
            <AppImage
              src={place.imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 14rem, 11rem"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <span className="absolute bottom-4 left-4 text-xl font-medium">{place.name}</span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
};

export default TourPlaces;
