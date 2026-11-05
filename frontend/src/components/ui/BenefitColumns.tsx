import type { TrustItem } from "@/types";
import Icon from "./Icon";

type BenefitColumnsProps = {
  items: TrustItem[];
  large?: boolean;
};

const BenefitColumns = ({ items, large = false }: BenefitColumnsProps) => {
  return (
    <ul className="mx-auto mt-12 grid max-w-content gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id} className="px-2 text-center">
          <Icon name={item.iconName} className="text-4xl text-primary" />
          <h2 className={`mt-4 ${large ? "text-xl font-medium" : "font-bold"}`}>{item.title}</h2>
          <p className={`mt-1 leading-relaxed text-ink-soft ${large ? "" : "text-sm"}`}>{item.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default BenefitColumns;
