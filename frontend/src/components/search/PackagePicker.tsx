import { cabinOptions, guestLimits, passengerLimits } from "@/constants";
import { formatCount } from "@/lib";
import type { CabinClass } from "@/types";
import CounterRow from "./CounterRow";
import PickerPopover from "./PickerPopover";

export type PackageTravelers = {
  rooms: number;
  adults: number;
  children: number;
  cabin: CabinClass;
};

type PackagePickerProps = {
  value: PackageTravelers;
  onChange: (value: PackageTravelers) => void;
};

const PackagePicker = ({ value, onChange }: PackagePickerProps) => {
  const summary = `${formatCount(value.rooms, "room")}, ${formatCount(value.adults + value.children, "traveler")}`;

  return (
    <PickerPopover iconName="user" summary={summary}>
      <CounterRow label="Rooms" value={value.rooms} {...guestLimits.rooms} onChange={(rooms) => onChange({ ...value, rooms })} />
      <CounterRow label="Adults" value={value.adults} {...passengerLimits.adults} onChange={(adults) => onChange({ ...value, adults })} />
      <CounterRow label="Children" value={value.children} {...passengerLimits.children} onChange={(children) => onChange({ ...value, children })} />
      <label className="mt-2 block font-medium">
        Cabin
        <select
          value={value.cabin}
          onChange={(event) => onChange({ ...value, cabin: event.target.value as CabinClass })}
          className="mt-1 h-10 w-full rounded-md border border-line bg-surface px-2 font-normal"
        >
          {cabinOptions.map((cabin) => (
            <option key={cabin}>{cabin}</option>
          ))}
        </select>
      </label>
    </PickerPopover>
  );
};

export default PackagePicker;
