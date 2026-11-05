import type { TrainsContent } from "@/types";
import WordmarkList from "../ui/WordmarkList";
import TrainSection from "./TrainSection";

type TrainOperatorsProps = {
  section: TrainsContent["operators"];
};

const TrainOperators = ({ section }: TrainOperatorsProps) => {
  return (
    <TrainSection id="operators" title={section.title}>
      <p className="-mt-2 mb-5 text-muted">{section.note}</p>
      <WordmarkList names={section.items} iconName="train" />
    </TrainSection>
  );
};

export default TrainOperators;
