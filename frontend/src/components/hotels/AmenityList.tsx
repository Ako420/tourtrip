import type { Amenity } from "@/types";
import Icon from "../ui/Icon";

type AmenityListProps = {
  amenities: Amenity[];
};

const AmenityList = ({ amenities }: AmenityListProps) => {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink-soft">
      {amenities.map((amenity) => (
        <li key={amenity.id} className="flex items-center gap-1.5">
          <Icon name={amenity.iconName} className="text-primary" />
          {amenity.label}
        </li>
      ))}
    </ul>
  );
};

export default AmenityList;
