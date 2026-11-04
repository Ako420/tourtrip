import type { Banner } from "@/types";
import BannerCard from "./BannerCard";

type BannerGridProps = {
  banners: Banner[];
};

const BannerGrid = ({ banners }: BannerGridProps) => {
  return (
    <section aria-label="Featured deals" className="mx-auto mt-10 grid max-w-content gap-4 lg:grid-cols-3">
      {banners.map((banner) => (
        <BannerCard key={banner.id} banner={banner} className={banner.theme === "primary" ? "lg:col-span-2" : ""} />
      ))}
    </section>
  );
};

export default BannerGrid;
