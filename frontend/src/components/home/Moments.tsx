import type { Section, TripMoment } from "@/types";
import Carousel from "../ui/Carousel";
import Icon from "../ui/Icon";
import MoreLink from "../ui/MoreLink";
import PhotoCard from "../ui/PhotoCard";
import SectionHeading from "../ui/SectionHeading";

type MomentsProps = {
  section: Section<TripMoment>;
};

const Moments = ({ section }: MomentsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading action={section.moreHref && <MoreLink href={section.moreHref} label="See all trip moments" />}>
        {section.title}
      </SectionHeading>

      <Carousel label="trip moments" slideClassName="w-44 sm:w-56 lg:w-[calc((100%-3rem)/4)]">
        {section.items.map((moment) => (
          <PhotoCard key={moment.id} href={moment.href} imageUrl={moment.imageUrl} title={moment.title}>
            <h3 className="line-clamp-2 font-semibold">{moment.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-white/85">
              <Icon name="location" />
              {moment.location}
            </p>
          </PhotoCard>
        ))}
      </Carousel>
    </section>
  );
};

export default Moments;
