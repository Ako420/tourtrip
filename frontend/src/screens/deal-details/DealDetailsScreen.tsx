import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AttractionGrid, DealCampaignHero, DealFlights, HotelGrid, Skeleton } from "@/components";
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
      <HotelGrid title="Hotels in this deal" hotels={campaign.hotels} />
      <DealFlights title="Flights in this deal" deals={campaign.flightDeals} />
      <AttractionGrid title="Tickets in this deal" attractions={campaign.attractions} />
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
