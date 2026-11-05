import { formatCount, formatShortDate } from "@/lib";
import type { CruiseDetails } from "@/types";
import Price from "../ui/Price";

type CruiseSailingsProps = {
  cruise: CruiseDetails;
};

const CruiseSailings = ({ cruise }: CruiseSailingsProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">Sailings</h2>

      {cruise.sailings.length > 0 ? (
        <ul className="divide-y divide-line rounded-card border border-line px-4">
          {cruise.sailings.map((sailing) => (
            <li key={sailing.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3 text-sm">
              <span className="font-medium">{formatShortDate(sailing.date)}</span>
              <span className="text-muted">
                {formatCount(sailing.nights, "night")} from {sailing.port}
              </span>
              <span className="font-bold"><Price amount={sailing.price} currency={cruise.currency} /></span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-line p-4 text-sm text-muted">There are no upcoming sailings right now.</p>
      )}
    </section>
  );
};

export default CruiseSailings;
