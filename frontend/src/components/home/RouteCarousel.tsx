import type { HomeRoute } from "@/types";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import RouteCard from "./RouteCard";

type RouteCarouselProps = {
  title: string;
  routes: HomeRoute[];
};

const RouteCarousel = ({ title, routes }: RouteCarouselProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{title}</SectionHeading>

      <Carousel label="routes" slideClassName="w-44 sm:w-56 lg:w-[calc((100%-3rem)/4)]">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </Carousel>
    </section>
  );
};

export default RouteCarousel;
