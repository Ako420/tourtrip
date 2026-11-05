import type { TrustItem } from "@/types";
import Icon from "../ui/Icon";

type TrainBenefitsProps = {
  items: TrustItem[];
};

const TrainBenefits = ({ items }: TrainBenefitsProps) => {
  return (
    <ul className="mx-auto mt-10 grid max-w-content gap-8 sm:grid-cols-2 sm:mt-12 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id} className="px-2 text-center">
          <Icon name={item.iconName} className="text-4xl text-primary" />
          <h2 className="mt-4 font-bold">{item.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.description}</p>
        </li>
      ))}
    </ul>
  );
};

export default TrainBenefits;
