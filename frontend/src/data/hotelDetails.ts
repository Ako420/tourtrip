import type { HotelDetails, HotelReview, HotelRoom } from "@/types";
import unsplashImage from "./unsplashImage";

type BaseRoom = Pick<HotelRoom, "id" | "name" | "beds" | "maxGuests" | "pricePerNight" | "isAvailable">;

export type BaseHotel = Omit<
  HotelDetails,
  "images" | "highlights" | "rooms" | "reviewScores" | "reviews" | "policies" | "nearby"
> & {
  rooms: BaseRoom[];
};

const photoIds = [
  "photo-1582719478250-c89cae4dc85b",
  "photo-1590490360182-c33d57733427",
  "photo-1611892440504-42a792e24d32",
  "photo-1618773928121-c32242e63f39",
  "photo-1496417263034-38ec4f0b665a",
  "photo-1564501049412-61c2a3083791",
  "photo-1445019980597-93fa8acb246c",
];

const reviewTemplates: Omit<HotelReview, "id" | "score">[] = [
  { author: "Amara O.", country: "Nigeria", stayDate: "October 2026", title: "Lovely stay", text: "The room was spotless and the staff remembered our names from the second day. We would happily come back." },
  { author: "Lukas M.", country: "Germany", stayDate: "September 2026", title: "Great location", text: "Easy to get around from here, and quiet at night. Check-in was quick even though we arrived late." },
  { author: "Priya S.", country: "India", stayDate: "August 2026", title: "Good value", text: "Comfortable bed, strong Wi-Fi and friendly service. It felt like more than we paid for." },
  { author: "Sofia R.", country: "Brazil", stayDate: "July 2026", title: "Relaxing break", text: "Calm atmosphere and thoughtful touches throughout. The team helped us plan our days out." },
  { author: "Daniel K.", country: "Kenya", stayDate: "June 2026", title: "Would recommend", text: "Everything worked as promised. A few small things could be newer, but the people made the stay." },
];

const clampScore = (score: number) => Math.min(Math.round(score * 10) / 10, 10);

// Adds sample details to each hotel, in the same shape as GET /hotels/:slug. Used until API_URL is set.
const withHotelDetails = (hotel: BaseHotel, index: number): HotelDetails => {
  const pickPhotos = (count: number, offset = 0) => {
    return Array.from({ length: count }, (_, position) => {
      return unsplashImage(photoIds[(index + offset + position) % photoIds.length], 1000);
    }).filter((url) => url !== hotel.imageUrl);
  };

  return {
    ...hotel,
    images: [hotel.imageUrl, ...pickPhotos(5)],
    highlights: [
      `${hotel.rating >= 9 ? "Exceptional" : "Well-rated"} stays in ${hotel.area}`,
      hotel.freeCancellation ? "Free cancellation on most rooms" : "Great rates when you book ahead",
      hotel.breakfastIncluded ? "Breakfast included" : "Cafes and restaurants close by",
    ],
    rooms: hotel.rooms.map((room, position) => ({
      ...room,
      imageUrl: pickPhotos(1, position + 2)[0] ?? hotel.imageUrl,
      sizeSqm: 24 + position * 12,
      freeCancellation: hotel.freeCancellation,
      breakfastIncluded: hotel.breakfastIncluded,
    })),
    reviewScores: [
      { id: "cleanliness", label: "Cleanliness", score: clampScore(hotel.rating + 0.2) },
      { id: "location", label: "Location", score: clampScore(hotel.rating + 0.1) },
      { id: "service", label: "Service", score: clampScore(hotel.rating) },
      { id: "facilities", label: "Facilities", score: clampScore(hotel.rating - 0.3) },
    ],
    reviews: Array.from({ length: 5 }, (_, position) => ({
      ...reviewTemplates[(index + position) % reviewTemplates.length],
      id: `${hotel.id}-${position}`,
      score: clampScore(hotel.rating + (position % 3) * 0.3 - 0.3),
    })),
    policies: [
      { id: "check-in", title: "Check-in and check-out", description: "Check-in from 2:00 PM. Check-out by 12:00 PM.", iconName: "clock" },
      {
        id: "cancellation",
        title: "Cancellation",
        description: hotel.freeCancellation
          ? "Free cancellation up to 48 hours before check-in."
          : "This rate cannot be cancelled or changed after booking.",
        iconName: "ban",
      },
      { id: "children", title: "Children", description: "Children of all ages are welcome. Extra beds depend on the room.", iconName: "child" },
      { id: "pets", title: "Pets", description: "Pets are not allowed, except for assistance animals.", iconName: "paw" },
      { id: "payment", title: "Payment", description: "Major cards are accepted at the property.", iconName: "credit-card" },
    ],
    nearby: [
      { id: "centre", name: `${hotel.city} city centre`, distance: `${(index % 4) + 1}.${index % 9} km`, iconName: "building" },
      { id: "station", name: "Nearest station", distance: `${((index % 5) + 3) * 100} m`, iconName: "train" },
      { id: "airport", name: "International airport", distance: `${12 + index * 3} km`, iconName: "plane" },
    ],
  };
};

export default withHotelDetails;
