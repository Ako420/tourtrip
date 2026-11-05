import type { TrustItem } from "@/types";
import Icon from "../ui/Icon";

type CarBenefitsProps = {
  items: TrustItem[];
};

const CarBenefits = ({ items }: CarBenefitsProps) => {
  return (
    <ul className="mx-auto mt-12 grid max-w-content gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id} className="rounded-card border border-line p-4">
          <Icon name={item.iconName} className="text-3xl text-primary" />
          <h2 className="mt-2 font-medium">{item.title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default CarBenefits;
