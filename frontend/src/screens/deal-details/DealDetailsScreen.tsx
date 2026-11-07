import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BenefitColumns, DealCampaignHero, DealProducts, Skeleton } from "@/components";
import { dealBenefits } from "@/constants";
import { getDealCampaign } from "@/services";

type DealDetailsScreenProps = {
  params: Promise<{ slug: string }>;
};

const DealDetailsContent = async ({ params }: DealDetailsScreenProps) => {
  const { slug } = await params;
  const campaign = await getDealCampaign(slug);

  if (!campaign) {
    notFound();
  }

  return (
    <>
      <DealCampaignHero campaign={campaign} />
      <DealProducts campaign={campaign} />
      <h2 className="mt-12 text-center text-2xl font-bold">Why book with Hotel Jr?</h2>
      <BenefitColumns items={dealBenefits} columns={3} />
    </>
  );
};

const DealDetailsScreen = ({ params }: DealDetailsScreenProps) => {
  return (
    <div className="pb-8">
      <Suspense fallback={<Skeleton className="h-96" />}>
        <DealDetailsContent params={params} />
      </Suspense>
    </div>
  );
};

export default DealDetailsScreen;
