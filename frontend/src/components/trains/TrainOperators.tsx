import type { TrainsContent } from "@/types";
import Icon from "../ui/Icon";
import TrainSection from "./TrainSection";

type TrainOperatorsProps = {
  section: TrainsContent["operators"];
};

const TrainOperators = ({ section }: TrainOperatorsProps) => {
  return (
    <TrainSection id="operators" title={section.title}>
      <p className="-mt-2 mb-5 text-muted">{section.note}</p>
      <ul className="grid gap-8 rounded-card bg-surface p-8 shadow-card sm:grid-cols-3">
        {section.items.map((name) => (
          <li key={name} className="flex items-center justify-center gap-3 text-xl font-bold text-ink-soft">
            <Icon name="train" className="text-primary" />
            {name}
          </li>
        ))}
      </ul>
    </TrainSection>
  );
};

export default TrainOperators;
