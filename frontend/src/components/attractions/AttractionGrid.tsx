import type { Attraction } from "@/types";
import AttractionCard from "./AttractionCard";

type AttractionGridProps = {
  title: string;
  attractions: Attraction[];
};

const AttractionGrid = ({ title, attractions }: AttractionGridProps) => {
  if (attractions.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-content">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>

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
