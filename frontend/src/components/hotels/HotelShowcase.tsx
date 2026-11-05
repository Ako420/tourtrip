import type { HotelSummary } from "@/types";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import HotelShowcaseCard from "./HotelShowcaseCard";

type HotelShowcaseProps = {
  title: string;
  hotels: HotelSummary[];
};

const HotelShowcase = ({ title, hotels }: HotelShowcaseProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{title}</SectionHeading>

      <Carousel label={title} slideClassName="w-56 sm:w-64 lg:w-[calc((100%-3rem)/4)]">
        {hotels.map((hotel) => (
          <HotelShowcaseCard key={hotel.id} hotel={hotel} />
        ))}
      </Carousel>
    </section>
  );
};

export default HotelShowcase;
