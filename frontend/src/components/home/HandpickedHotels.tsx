import type { HotelSummary } from "@/types";
import HotelStayCard from "../hotels/HotelStayCard";
import Carousel from "../ui/Carousel";
import MoreLink from "../ui/MoreLink";
import SectionHeading from "../ui/SectionHeading";

type HandpickedHotelsProps = {
  title: string;
  moreHref: string;
  hotels: HotelSummary[];
};

const HandpickedHotels = ({ title, moreHref, hotels }: HandpickedHotelsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading action={<MoreLink href={moreHref} label="See all hotels" />}>{title}</SectionHeading>

      <Carousel label="hotels" slideClassName="w-44 sm:w-56 lg:w-[calc((100%-3rem)/4)]">
        {hotels.map((hotel) => (
          <HotelStayCard key={hotel.id} hotel={hotel} />
        ))}
      </Carousel>
    </section>
  );
};

export default HandpickedHotels;
