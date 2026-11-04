"use client";

import { useTripPlan } from "@/hooks";
import { createTripPlan } from "@/lib";
import type { PlannerSuggestion } from "@/types";
import AppImage from "../ui/AppImage";
import Skeleton from "../ui/Skeleton";
import PlannerBoard from "./PlannerBoard";
import PlannerSetupForm from "./PlannerSetupForm";

type TripPlannerProps = {
  suggestions: PlannerSuggestion[];
  heroImageUrl: string;
};

const TripPlanner = ({ suggestions, heroImageUrl }: TripPlannerProps) => {
  const { plan, isReady, savePlan, clearPlan } = useTripPlan();

  if (!isReady) {
    return <Skeleton className="h-96 rounded-panel" />;
  }

  if (plan) {
    return <PlannerBoard plan={plan} suggestions={suggestions} onChange={savePlan} onReset={clearPlan} />;
  }

  const destinations = [...new Set(suggestions.map((suggestion) => suggestion.city))];

  return (
    <section className="relative overflow-hidden rounded-panel bg-primary-deep px-4 py-10 text-white sm:px-10 sm:py-14">
      <AppImage src={heroImageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 to-ink/40" />

      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Plan your trip<span className="text-accent">.</span>
        </h1>
        <p className="mt-1 mb-6 text-white/90">Build your days, add activities and see what it could cost.</p>
        <PlannerSetupForm
          destinations={destinations}
          onCreate={(setup) => savePlan(createTripPlan(setup, suggestions[0]?.currency ?? "USD"))}
        />
      </div>
    </section>
  );
};

export default TripPlanner;
