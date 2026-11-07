import Link from "next/link";
import type { TrainsContent } from "@/types";
import TrainSection from "./TrainSection";

type TrainJourneysProps = {
  section: TrainsContent["journeys"];
};

const TrainJourneys = ({ section }: TrainJourneysProps) => {
  return (
    <TrainSection title={section.title}>
      <div className="grid gap-x-20 gap-y-8 rounded-card bg-surface p-6 shadow-card sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((column) => (
          <div key={column.id}>
            <h3 className="border-b border-line pb-2 text-2xl font-semibold">{column.title}</h3>
            <ul className="mt-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-1 transition-colors duration-300 ease-out hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </TrainSection>
  );
};

export default TrainJourneys;
