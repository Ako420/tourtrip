import type { Banner, Section } from "@/types";
import BannerCard from "../home/BannerCard";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";

type BannerCarouselProps = {
  section: Pick<Section<Banner>, "items"> & { title?: string };
};

const BannerCarousel = ({ section }: BannerCarouselProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      {section.title && <SectionHeading>{section.title}</SectionHeading>}

      <Carousel label="promotions" slideClassName="w-72 lg:w-[calc((100%-2rem)/3)]">
        {section.items.map((banner) => (
          <BannerCard key={banner.id} banner={banner} className="h-full" />
        ))}
      </Carousel>
    </section>
  );
};

export default BannerCarousel;
