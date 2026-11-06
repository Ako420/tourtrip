import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AttractionGrid, GuideArticle, GuideHeader, HotelGrid, MoreGuides, Skeleton } from "@/components";
import { getGuideBySlug, getHotels, getMoreGuides, searchAttractions } from "@/services";

type GuideDetailsScreenProps = {
  params: Promise<{ slug: string }>;
};

const GuideDetailsContent = async ({ params }: GuideDetailsScreenProps) => {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const [hotels, attractions, moreGuides] = await Promise.all([
    getHotels({ destination: guide.city }),
    searchAttractions({ query: guide.city, category: "all", freeCancellation: false, sort: "recommended", page: 1 }),
    getMoreGuides(guide),
  ]);

  return (
    <>
      <GuideHeader guide={guide} />
      <GuideArticle body={guide.body} imageUrl={guide.coverUrl} />
      <HotelGrid title={`Places to stay in ${guide.city}`} hotels={hotels.slice(0, 4)} />
      <AttractionGrid title={`Things to do in ${guide.city}`} attractions={attractions.items.slice(0, 4)} />
      <MoreGuides guides={moreGuides} />
    </>
  );
};

const GuideDetailsScreen = ({ params }: GuideDetailsScreenProps) => {
  return (
    <div className="pb-8">
      <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-content" />}>
        <GuideDetailsContent params={params} />
      </Suspense>
    </div>
  );
};

export default GuideDetailsScreen;
