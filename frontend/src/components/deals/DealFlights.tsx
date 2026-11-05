import type { FlightDeal } from "@/types";
import FlightDealCard from "../flights/FlightDealCard";
import SectionHeading from "../ui/SectionHeading";

type DealFlightsProps = {
  title: string;
  deals: FlightDeal[];
};

const DealFlights = ({ title, deals }: DealFlightsProps) => {
  if (deals.length === 0) return null;

  return (
    <section className="mx-auto mt-12 max-w-content">
      <SectionHeading>{title}</SectionHeading>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((deal) => (
          <li key={deal.id}>
            <FlightDealCard deal={deal} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default DealFlights;
