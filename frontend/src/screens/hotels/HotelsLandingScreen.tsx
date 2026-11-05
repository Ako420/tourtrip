import { Suspense } from "react";
import {
  AppPromo,
  DealCampaignCard,
  FlightsSkeleton,
  FlightTips,
  HotelBenefits,
  HotelOfferBanner,
  HotelsAbout,
  HotelShowcase,
  HotelsHero,
  HotelStats,
  Recommendations,
  SectionHeading,
  StickyHotelSearch,
} from "@/components";
import { getDeals, getDestinations, getHomeContent, getHotels, getHotelsContent } from "@/services";

const SHOWCASE_SIZE = 6;
const WHATS_NEW_SIZE = 3;

const HotelsLandingContent = async () => {
  const [content, hotels, destinations, deals, home] = await Promise.all([
    getHotelsContent(),
    getHotels(),
    getDestinations(),
    getDeals(),
    getHomeContent(),
  ]);
  const luxury = hotels.filter((hotel) => hotel.stars === 5);
  const budget = hotels.toSorted((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));
  const popular = hotels.toSorted((a, b) => b.rating - a.rating);

  return (
    <>
      <HotelsHero hero={content.hero} destinations={destinations} />
      <StickyHotelSearch destinations={destinations} />

      <div className="page-sheet bg-surface! px-4 pt-16">
        <HotelOfferBanner offer={content.offer} />

        <section className="mx-auto mt-12 max-w-content">
          <SectionHeading>{content.whatsNewTitle}</SectionHeading>
          <ul className="grid gap-4 md:grid-cols-3">
            {deals.campaigns.slice(0, WHATS_NEW_SIZE).map((campaign) => (
              <li key={campaign.slug}>
                <DealCampaignCard campaign={campaign} />
              </li>
            ))}
          </ul>
        </section>

        <HotelBenefits items={content.benefits} />
        <HotelShowcase title={content.showcases.luxuryTitle} hotels={luxury.slice(0, SHOWCASE_SIZE)} />
        <HotelShowcase title={content.showcases.budgetTitle} hotels={budget.slice(0, SHOWCASE_SIZE)} />
        <HotelShowcase title={content.showcases.popularTitle} hotels={popular.slice(0, SHOWCASE_SIZE)} />
        <FlightTips section={content.faqs} />
        <HotelStats title={content.statsTitle} hotels={hotels} />
        <HotelsAbout about={content.about} />
        <Recommendations section={content.recommendations} variant="underline" />
      </div>

      <AppPromo app={home.app} />
    </>
  );
};

const HotelsLandingScreen = () => {
  return (
    <Suspense fallback={<FlightsSkeleton />}>
      <HotelsLandingContent />
    </Suspense>
  );
};

export default HotelsLandingScreen;
