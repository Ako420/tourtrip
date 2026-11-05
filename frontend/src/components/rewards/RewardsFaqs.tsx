"use client";

import { useState } from "react";
import type { RewardsProgram } from "@/types";
import FaqList from "../ui/FaqList";
import PillTabs from "../ui/PillTabs";

type RewardsFaqsProps = {
  faqs: RewardsProgram["faqs"];
};

const RewardsFaqs = ({ faqs }: RewardsFaqsProps) => {
  const [activeId, setActiveId] = useState(faqs.groups[0]?.id ?? "");
  const activeGroup = faqs.groups.find((group) => group.id === activeId);

  return (
    <section className="mx-auto mt-16 max-w-content sm:mt-24">
      <h2 className="text-center type-section-lg font-bold">{faqs.title}</h2>

      <div className="mt-6 flex justify-center">
        <PillTabs options={faqs.groups} activeId={activeId} onChange={setActiveId} />
      </div>

      {activeGroup?.intro && <p className="mt-6 text-center">{activeGroup.intro}</p>}
      <div className="mt-6">
        <FaqList items={activeGroup?.items ?? []} />
      </div>
    </section>
  );
};

export default RewardsFaqs;
