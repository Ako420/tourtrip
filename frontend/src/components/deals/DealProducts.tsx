import type { DealCampaignDetails } from "@/types";
import AttractionCard from "../attractions/AttractionCard";
import FlightDealCard from "../flights/FlightDealCard";
import HotelStayCard from "../hotels/HotelStayCard";
import DealSection from "./DealSection";

type DealProductsProps = {
  campaign: DealCampaignDetails;
};

const gridClass = "grid grid-cols-2 gap-4 lg:grid-cols-4";

const DealProducts = ({ campaign }: DealProductsProps) => {
  return (
    <>
      {campaign.hotels.length > 0 && (
        <DealSection title="Hotels in this deal" moreHref="/hotels/list" moreLabel="More hotels">
          <ul className={gridClass}>
            {campaign.hotels.map((hotel) => (
              <li key={hotel.id}>
                <HotelStayCard hotel={hotel} />
              </li>
            ))}
          </ul>
        </DealSection>
      )}

      {campaign.flightDeals.length > 0 && (
        <DealSection title="Flights in this deal" moreHref="/flights" moreLabel="More flights">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {campaign.flightDeals.map((deal) => (
              <li key={deal.id}>
                <FlightDealCard deal={deal} />
              </li>
            ))}
          </ul>
        </DealSection>
      )}

      {campaign.attractions.length > 0 && (
        <DealSection title="Tickets in this deal" moreHref="/attractions" moreLabel="More attractions">
          <ul className={gridClass}>
            {campaign.attractions.map((attraction) => (
              <li key={attraction.id}>
                <AttractionCard attraction={attraction} />
              </li>
            ))}
          </ul>
        </DealSection>
      )}
    </>
  );
};

export default DealProducts;
