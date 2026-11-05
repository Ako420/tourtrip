import type { Promotion } from "@/types";
import PromotionCard from "../home/PromotionCard";
import SectionHeading from "../ui/SectionHeading";

type DealCouponsProps = {
  promotions: Promotion[];
};

const DealCoupons = ({ promotions }: DealCouponsProps) => {
  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>Member coupons</SectionHeading>
      <p className="-mt-3 mb-5 text-sm text-muted">Coupons cannot be claimed or used at checkout yet.</p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promotion) => (
          <li key={promotion.id} className="h-40">
            <PromotionCard promotion={promotion} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DealCoupons;
