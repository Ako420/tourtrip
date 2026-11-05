import { Suspense } from "react";
import {
  AppPromo,
  BannerGrid,
  Hero,
  HomeExplorer,
  HomeSkeleton,
  PromotionSection,
  Recommendations,
} from "@/components";
import { getDestinations, getHomeContent, getHomeDestinations, getHotels } from "@/services";

const HomeContent = async () => {
  const [content, destinations, hotels, homeDestinations] = await Promise.all([
    getHomeContent(),
    getDestinations(),
    getHotels(),
    getHomeDestinations(),
  ]);

  return (
    <>
      <Hero hero={content.hero} destinations={destinations} />
      <PromotionSection section={content.promotions} />
      <BannerGrid banners={content.banners} />
      <HomeExplorer content={content} hotels={hotels.slice(0, 6)} destinations={homeDestinations} />

      {/* These two run edge to edge, so they cancel the page padding. */}
      <div className="-mx-4 lg:-mx-8">
        <AppPromo app={content.app} />
      </div>
      <div className="-mx-4 -mb-4 flow-root bg-surface-alt px-4 lg:-mx-8 lg:-mb-8 lg:px-8">
        <Recommendations section={content.recommendations} />
      </div>
    </>
  );
};

const HomeScreen = () => {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
};

export default HomeScreen;
