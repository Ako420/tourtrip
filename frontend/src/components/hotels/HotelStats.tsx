import { formatPrice } from "@/lib";
import type { HotelSummary } from "@/types";
import SectionHeading from "../ui/SectionHeading";

type HotelStatsProps = {
  title: string;
  hotels: HotelSummary[];
};

const HotelStats = ({ title, hotels }: HotelStatsProps) => {
  const lowest = hotels.toSorted((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight))[0];
  const stats = [
    { label: "Stays", value: String(hotels.length) },
    { label: "Cities", value: String(new Set(hotels.map((hotel) => hotel.city)).size) },
    { label: "Countries", value: String(new Set(hotels.map((hotel) => hotel.country)).size) },
    ...(lowest ? [{ label: "Prices from", value: formatPrice(lowest.pricePerNight, lowest.currency) }] : []),
  ];

  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{title}</SectionHeading>

      <dl className="grid grid-cols-2 gap-4 rounded-card border border-line p-5 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="text-2xl font-bold">{stat.value}</dd>
            <dt className="text-sm text-ink-soft">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default HotelStats;
