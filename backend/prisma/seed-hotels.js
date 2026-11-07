import { readFileSync } from "node:fs";
import { prisma } from "../src/config/db.js";
import { hostImages } from "./seed-images.js";

const SAMPLE_HOTELS = new URL("./seed-data/hotels.json", import.meta.url);

const seedAmenities = async (hotels) => {
  const amenities = new Map(hotels.flatMap(({ amenities }) => amenities.map((amenity) => [amenity.id, amenity])));

  for (const { id, label, iconName } of amenities.values()) {
    await prisma.amenity.upsert({ where: { id }, update: { label, iconName }, create: { id, label, iconName } });
  }
};

const seedHotel = async ({ id, amenities, rooms, reviews, featuredRoom, ...hotel }, sortRank) => {
  const amenityIds = amenities.map((amenity) => ({ id: amenity.id }));
  const data = {
    ...hotel,
    pricePerNight: Math.min(...rooms.map((room) => Number(room.pricePerNight))),
    sortRank,
  };

  await prisma.hotel.upsert({
    where: { id },
    update: { ...data, amenities: { set: amenityIds } },
    create: { ...data, id, amenities: { connect: amenityIds } },
  });

  for (const { id: roomId, ...room } of rooms) {
    await prisma.roomType.upsert({
      where: { id: roomId },
      update: room,
      create: { ...room, id: roomId, hotelId: id },
    });
  }

  for (const { id: reviewId, ...review } of reviews) {
    // Dated by the stay, or "latest" would only mean the order this loop ran in.
    const data = { ...review, createdAt: new Date(`1 ${review.stayDate} UTC`) };

    await prisma.review.upsert({
      where: { id: reviewId },
      update: data,
      create: { ...data, id: reviewId, hotelId: id },
    });
  }
};

export const seedHotels = async () => {
  const samples = JSON.parse(readFileSync(SAMPLE_HOTELS, "utf8"));
  const hotels = await hostImages(samples, "hotels");

  await seedAmenities(hotels);

  for (const [index, hotel] of hotels.entries()) {
    await seedHotel(hotel, index + 1);
  }

  console.log(`Seeded ${hotels.length} hotels`);
};
