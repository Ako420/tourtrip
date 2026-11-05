"use client";

import { useState } from "react";
import { dealProducts } from "@/constants";
import type { DealCampaign, DealProduct } from "@/types";
import PillTabs from "../ui/PillTabs";
import DealCampaignCard from "./DealCampaignCard";

type DealCampaignsProps = {
  campaigns: DealCampaign[];
};

const DealCampaigns = ({ campaigns }: DealCampaignsProps) => {
  const [productId, setProductId] = useState<DealProduct | "all">("all");
  const visibleCampaigns = campaigns.filter((campaign) => productId === "all" || campaign.product === productId);

  return (
    <section className="mx-auto max-w-content">
      <PillTabs options={dealProducts} activeId={productId} onChange={setProductId} />

      {visibleCampaigns.length > 0 ? (
        <ul className="mt-5 grid gap-5 md:grid-cols-2">
          {visibleCampaigns.map((campaign) => (
            <li key={campaign.slug}>
              <DealCampaignCard campaign={campaign} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-card border border-line p-5 text-sm text-muted">There are no deals here right now.</p>
      )}
    </section>
  );
};

export default DealCampaigns;
