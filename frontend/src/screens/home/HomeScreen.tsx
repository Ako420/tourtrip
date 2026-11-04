import { Suspense } from "react";
import {
  BannerGrid,
  HandpickedHotels,
  Hero,
  HomeSkeleton,
  Inspiration,
  Moments,
  Places,
  PromotionSection,
  Recommendations,
} from "@/components";
import { getDestinations, getHomeContent, getHotels } from "@/services";

const HomeContent = async () => {
  const [content, destinations, hotels] = await Promise.all([
    getHomeContent(),
    getDestinations(),
    getHotels(),
  ]);

  return (
    <>
      <Hero hero={content.hero} destinations={destinations} />
      <PromotionSection section={content.promotions} />
      <BannerGrid banners={content.banners} />
      <Inspiration section={content.inspiration} />
      <Places section={content.places} />
      <Moments section={content.moments} />
      <HandpickedHotels
        title={content.handpickedHotels.title}
        moreHref={content.handpickedHotels.moreHref}
        hotels={hotels.slice(0, 6)}
      />
      <Recommendations section={content.recommendations} />
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
