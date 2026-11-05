import type { TrainsContent } from "@/types";
import FaqList from "../ui/FaqList";
import TrainSection from "./TrainSection";

type TrainStepsProps = {
  section: TrainsContent["steps"];
};

const TrainSteps = ({ section }: TrainStepsProps) => {
  return (
    <TrainSection id="how-to-book" title={section.title}>
      <FaqList items={section.items} large />
    </TrainSection>
  );
};

export default TrainSteps;
