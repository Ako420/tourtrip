import type { Guide } from "@/types";
import GuideCard from "./GuideCard";

type GuideGridProps = {
  guides: Guide[];
};

const GuideGrid = ({ guides }: GuideGridProps) => {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => (
        <li key={guide.id}>
          <GuideCard guide={guide} />
        </li>
      ))}
    </ul>
  );
};

export default GuideGrid;
