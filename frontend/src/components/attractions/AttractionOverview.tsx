import type { AttractionDetails } from "@/types";
import Icon from "../ui/Icon";

type AttractionOverviewProps = {
  attraction: AttractionDetails;
};

const AttractionOverview = ({ attraction }: AttractionOverviewProps) => {
  return (
    <section id="overview" className="mt-6 grid scroll-mt-32 gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <h2 className="text-xl font-bold">About this experience</h2>
        <p className="mt-2 text-ink-soft">{attraction.description}</p>
      </div>
      <ul className="flex flex-col gap-2 rounded-card bg-primary-soft p-4 text-sm">
        {attraction.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-2">
            <Icon name="check" className="mt-0.5 text-primary" />
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AttractionOverview;
