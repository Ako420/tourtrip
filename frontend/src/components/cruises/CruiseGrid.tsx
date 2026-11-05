import type { CruiseListing } from "@/types";
import CruiseCard from "./CruiseCard";

type CruiseGridProps = {
  cruises: CruiseListing[];
};

const CruiseGrid = ({ cruises }: CruiseGridProps) => {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cruises.map((cruise) => (
        <li key={cruise.id}>
          <CruiseCard cruise={cruise} />
        </li>
      ))}
    </ul>
  );
};

export default CruiseGrid;
