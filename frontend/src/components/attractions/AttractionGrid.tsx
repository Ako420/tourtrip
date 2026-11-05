import type { Attraction } from "@/types";
import AttractionCard from "./AttractionCard";
import SectionHeading from "../ui/SectionHeading";

type AttractionGridProps = {
  title: string;
  attractions: Attraction[];
};

const AttractionGrid = ({ title, attractions }: AttractionGridProps) => {
  if (attractions.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{title}</SectionHeading>

      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {attractions.map((attraction) => (
          <li key={attraction.id}>
            <AttractionCard attraction={attraction} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AttractionGrid;
