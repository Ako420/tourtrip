import type { AttractionDetails } from "@/types";

type AttractionOverviewProps = {
  attraction: AttractionDetails;
};

const AttractionOverview = ({ attraction }: AttractionOverviewProps) => {
  return (
    <section id="overview" className="scroll-mt-32 rounded-card bg-surface p-5">
      <h2 className="text-2xl font-bold">About this experience</h2>
      <p className="mt-3 text-sm text-ink-soft">{attraction.description}</p>
    </section>
  );
};

export default AttractionOverview;
