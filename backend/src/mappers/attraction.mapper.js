import { toMoney } from "../utils/money.js";
import { toReview } from "./hotel.mapper.js";

const toTicketOption = ({ id, name, description, includes, adultPrice, childPrice }) => {
  return { id, name, description, includes, adultPrice: toMoney(adultPrice), childPrice: toMoney(childPrice) };
};

export const toAttraction = (attraction) => {
  const { id, slug, name, city, country, category, imageUrl, rating } = attraction;
  const { reviewCount, duration, price, currency, freeCancellation } = attraction;

  return {
    id,
    slug,
    name,
    city,
    country,
    category,
    imageUrl,
    rating,
    reviewCount,
    duration,
    price: toMoney(price),
    currency,
    freeCancellation,
  };
};

export const toAttractionDetails = (attraction) => {
  const { description, highlights, address, reviewScores, policies, nearby } = attraction;

  return {
    ...toAttraction(attraction),
    description,
    highlights,
    address,
    tickets: attraction.tickets.map(toTicketOption),
    reviewScores,
    reviews: attraction.reviews.map(toReview),
    policies,
    nearby,
  };
};

// The price is a number here, because PlannerSuggestion doesn't accept money text.
export const toPlannerSuggestion = ({ id, slug, name, city, country, imageUrl, duration, price, currency }) => {
  return { id, slug, name, city, country, imageUrl, duration, price: price.toNumber(), currency };
};
