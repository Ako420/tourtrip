import type { PackageDeal, PackagesContent } from "@/types";
import Carousel from "../ui/Carousel";
import SectionHeading from "../ui/SectionHeading";
import PackageDealCard from "./PackageDealCard";

type PackageDealsProps = {
  section: PackagesContent["deals"];
  deals: PackageDeal[];
};

const PackageDeals = ({ section, deals }: PackageDealsProps) => {
  if (deals.length === 0) return null;

  return (
    <section className="mx-auto mt-10 max-w-content">
      <SectionHeading>{section.title}</SectionHeading>
      <p className="-mt-3 mb-4 text-sm text-muted">{section.note}</p>

      <Carousel label="deals" slideClassName="w-80 lg:w-[calc((100%-2rem)/3)]">
        {deals.map((deal) => (
          <PackageDealCard key={deal.id} deal={deal} />
        ))}
      </Carousel>
    </section>
  );
};

export default PackageDeals;
