import type { TrustItem } from "@/types";
import Icon from "../ui/Icon";

type HotelBenefitsProps = {
  items: TrustItem[];
};

const HotelBenefits = ({ items }: HotelBenefitsProps) => {
  return (
    <ul className="mx-auto mt-12 grid max-w-content gap-6 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Icon name={item.iconName} />
          </span>
          <span>
            <span className="block font-bold">{item.title}</span>
            <span className="mt-1 block text-sm text-ink-soft">{item.description}</span>
          </span>
        </li>
      ))}
    </ul>
  );
};

export default HotelBenefits;
