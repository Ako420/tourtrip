import type { Attraction } from "@/types";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import AttractionCard from "./AttractionCard";

type SimilarAttractionsProps = {
  attractions: Attraction[];
};

const SimilarAttractions = ({ attractions }: SimilarAttractionsProps) => {
  return (
    <section className="mt-12">
      <SectionHeading>You may also like</SectionHeading>
      <Carousel label="attractions" slideClassName="w-44 sm:w-56 lg:w-[calc((100%-3rem)/4)]">
        {attractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </Carousel>
    </section>
  );
};

export default SimilarAttractions;
