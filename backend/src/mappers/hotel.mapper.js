import { toMoney } from "../utils/money.js";

export const toAmenity = ({ id, label, iconName }) => ({ id, label, iconName });

const toRoom = (room) => {
  const { id, name, beds, maxGuests, isAvailable, imageUrl, sizeSqm, freeCancellation, breakfastIncluded } = room;

  return {
    id,
    name,
    beds,
    maxGuests,
    pricePerNight: toMoney(room.pricePerNight),
    isAvailable,
    imageUrl,
    sizeSqm,
    freeCancellation,
    breakfastIncluded,
  };
};

export const toReview = ({ id, author, country, score, stayDate, title, text }) => {
  return { id, author, country, score, stayDate, title, text };
};

const getFeaturedRoom = (rooms) => {
  const availableRooms = rooms.filter((room) => room.isAvailable);
  const choices = availableRooms.length > 0 ? availableRooms : rooms;
  const [cheapest] = choices.toSorted((a, b) => Number(a.pricePerNight) - Number(b.pricePerNight));

  return { name: cheapest?.name ?? "", beds: cheapest?.beds ?? "" };
};

export const toHotelSummary = (hotel) => {
  const { id, slug, name, area, city, country, imageUrl, stars, rating, reviewCount } = hotel;
  const { currency, originalPrice, freeCancellation, breakfastIncluded } = hotel;

  return {
    id,
    slug,
    name,
    area,
    city,
    country,
    imageUrl,
    stars,
    rating,
    reviewCount,
    pricePerNight: toMoney(hotel.pricePerNight),
    originalPrice: originalPrice ? toMoney(originalPrice) : undefined,
    currency,
    amenities: hotel.amenities.map(toAmenity),
    freeCancellation,
    breakfastIncluded,
    featuredRoom: getFeaturedRoom(hotel.rooms),
  };
};

export const toHotelDetails = (hotel) => {
  const { address, description, images, highlights, reviewScores, policies, nearby } = hotel;

  return {
    ...toHotelSummary(hotel),
    address,
    description,
    images,
    highlights,
    rooms: hotel.rooms.map(toRoom),
    reviewScores,
    reviews: hotel.reviews.map(toReview),
    policies,
    nearby,
  };
};
