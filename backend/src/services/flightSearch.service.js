import { getPageInfo } from "../utils/pagination.js";
import { getFlightOffers } from "./flightOffer.service.js";

const PAGE_SIZE = 6;

export const searchFlights = async ({ nonstop, page: requestedPage, ...search }) => {
  const offers = await getFlightOffers(search);
  const matches = nonstop ? offers.filter(({ outbound }) => outbound.stops === 0) : offers;
  const { page, pageCount, skip, take } = getPageInfo(matches.length, requestedPage, PAGE_SIZE);

  return { items: matches.slice(skip, skip + take), total: matches.length, page, pageCount };
};
