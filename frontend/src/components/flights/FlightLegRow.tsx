import { formatClockTime, formatCount, formatDuration, formatShortDate } from "@/lib";
import type { FlightLeg } from "@/types";
import Icon from "../ui/Icon";

type FlightLegRowProps = {
  leg: FlightLeg;
  showDate?: boolean;
  vehicle?: "plane" | "train";
  large?: boolean;
};

const FlightLegRow = ({ leg, showDate = true, vehicle = "plane", large = false }: FlightLegRowProps) => {
  const arrivalMinutes = leg.departMinutes + leg.durationMinutes;
  const dayOffset = Math.floor(arrivalMinutes / 1440);
  const isTrain = vehicle === "train";
  const directLabel = isTrain ? "Direct" : "Nonstop";
  const stopLabel = leg.stops === 0 ? directLabel : formatCount(leg.stops, isTrain ? "change" : "stop");
  const timeClass = `font-bold ${large ? "text-xl" : "text-lg"}`;
  const placeClass = large ? "text-sm text-ink-soft" : "text-xs text-muted";

  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <div>
        <p className={timeClass}>{formatClockTime(leg.departMinutes)}</p>
        <p className={placeClass}>{leg.from}</p>
      </div>

      <div className="min-w-0 text-center">
        <p className="text-xs text-muted">{formatDuration(leg.durationMinutes)}</p>
        <div className="relative my-1 h-px bg-line">
          <Icon name={vehicle} className="absolute -top-1.5 right-0 text-xs text-primary" />
        </div>
        <p className={`truncate text-xs ${leg.stops === 0 ? "text-success" : "text-muted"}`}>
          {stopLabel}
          {leg.stopCity && ` via ${leg.stopCity}`}
        </p>
      </div>

      <div className="text-right">
        <p className={timeClass}>
          {formatClockTime(arrivalMinutes)}
          {dayOffset > 0 && <sup className="ml-0.5 text-xs text-accent">+{dayOffset}</sup>}
        </p>
        <p className={placeClass}>{leg.to}</p>
      </div>

      {showDate && <p className="col-span-3 -mt-2 text-xs text-muted sm:hidden">{formatShortDate(leg.date)}</p>}
    </div>
  );
};

export default FlightLegRow;
