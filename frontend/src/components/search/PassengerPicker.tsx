import { cabinOptions, passengerLimits } from "@/constants";
import { formatCount } from "@/lib";
import type { CabinClass } from "@/types";
import CounterRow from "./CounterRow";
import PickerPopover from "./PickerPopover";

export type PassengerValues = {
  adults: number;
  children: number;
  cabin: CabinClass;
};

type PassengerPickerProps = {
  value: PassengerValues;
  onChange: (value: PassengerValues) => void;
};

const PassengerPicker = ({ value, onChange }: PassengerPickerProps) => {
  const travelers = value.adults + value.children;

  return (
    <PickerPopover iconName="user" summary={`${formatCount(travelers, "traveler")} · ${value.cabin}`}>
      <CounterRow
        label="Adults"
        value={value.adults}
        {...passengerLimits.adults}
        onChange={(adults) => onChange({ ...value, adults })}
      />
      <CounterRow
        label="Children"
        value={value.children}
        {...passengerLimits.children}
        onChange={(children) => onChange({ ...value, children })}
      />
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

export default PassengerPicker;
