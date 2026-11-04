import { Suspense } from "react";
import { Skeleton, TripPlanner } from "@/components";
import { getPlannerContent, getPlannerSuggestions } from "@/services";

const PlannerContent = async () => {
  const [content, suggestions] = await Promise.all([getPlannerContent(), getPlannerSuggestions()]);

  return <TripPlanner suggestions={suggestions} heroImageUrl={content.heroImageUrl} />;
};

const PlannerScreen = () => {
  return (
    <div className="mx-auto max-w-content pb-8">
      <Suspense fallback={<Skeleton className="h-96 rounded-panel" />}>
        <PlannerContent />
      </Suspense>
    </div>
  );
};

export default PlannerScreen;
