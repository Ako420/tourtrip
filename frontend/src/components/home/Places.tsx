import { formatCount } from "@/lib";
import type { Place, Section } from "@/types";
import Carousel from "../ui/Carousel";
import Icon from "../ui/Icon";
import MoreLink from "../ui/MoreLink";
import PhotoCard from "../ui/PhotoCard";
import SectionHeading from "../ui/SectionHeading";

type PlacesProps = {
  section: Section<Place>;
};

const Places = ({ section }: PlacesProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading action={section.moreHref && <MoreLink href={section.moreHref} label="See all places" />}>
        {section.title}
      </SectionHeading>

      <Carousel label="places" slideClassName="w-44 sm:w-56 lg:w-[calc((100%-3rem)/4)]">
        {section.items.map((place) => (
          <PhotoCard key={place.id} href={place.href} imageUrl={place.imageUrl} title={place.name} badge={place.badge}>
            <p className="flex items-center gap-1 text-xs text-white/85">
              <Icon name="location" />
              {place.city}
            </p>
            <h3 className="mt-0.5 font-semibold">{place.name}</h3>
            <p className="text-xs text-white/85">
              {place.rating}/5 · {formatCount(place.reviewCount, "review")}
            </p>
          </PhotoCard>
        ))}
      </Carousel>
    </section>
  );
};

export default Places;
