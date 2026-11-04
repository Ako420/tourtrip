import { carCategories, carTransmissions } from "@/constants";
import type { CarCategory, CarOffer, CarSearch } from "@/types";
import unsplashImage from "./unsplashImage";

const carDetails: Record<CarCategory, { name: string; photoId: string; seats: number; bags: number; dayPrice: number }> = {
  economy: { name: "Fiat 500 or similar", photoId: "photo-1549317661-bd32c8ce0db2", seats: 4, bags: 1, dayPrice: 24 },
  compact: { name: "Volkswagen Polo or similar", photoId: "photo-1541899481282-d53bffe3c35d", seats: 5, bags: 2, dayPrice: 31 },
  sedan: { name: "BMW 4 Series or similar", photoId: "photo-1502877338535-766e1452684a", seats: 5, bags: 3, dayPrice: 48 },
  suv: { name: "Honda CR-V or similar", photoId: "photo-1519641471654-76ce0107ad1b", seats: 5, bags: 4, dayPrice: 57 },
  van: { name: "Volkswagen Transporter or similar", photoId: "photo-1469854523086-cc02fe5d8800", seats: 8, bags: 5, dayPrice: 74 },
  luxury: { name: "Porsche Panamera or similar", photoId: "photo-1503376780353-7e6692767b70", seats: 4, bags: 2, dayPrice: 145 },
};

const suppliers = [
  { name: "Roadway Rentals", rating: 8.8, factor: 1 },
  { name: "CityDrive", rating: 8.3, factor: 0.92 },
  { name: "Atlas Car Hire", rating: 9.1, factor: 1.12 },
];

const NON_STANDARD_AGE_FACTOR = 1.15;

const hash = (text: string) => {
  return [...text].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 100_003, 7);
};

// Builds repeatable sample cars for any location. A real API replaces this.
const buildCarOffers = (search: CarSearch, days: number): CarOffer[] => {
  const locationFactor = 0.85 + (hash(search.location?.toLowerCase() ?? "") % 40) / 100;
  const ageFactor = search.isStandardAge ? 1 : NON_STANDARD_AGE_FACTOR;

  // Grouped by supplier so the default order shows a mix of car types.
  return suppliers.flatMap((supplier, supplierIndex) => {
    return carCategories.map(({ id, label }, categoryIndex) => {
      const car = carDetails[id];
      const pricePerDay = Math.round(car.dayPrice * supplier.factor * locationFactor * ageFactor);
      const index = categoryIndex + supplierIndex;

      return {
        id: `car-${id}-${supplierIndex + 1}`,
        name: car.name,
        category: id,
        categoryLabel: label,
        imageUrl: unsplashImage(car.photoId, 600),
        supplier: supplier.name,
        supplierRating: supplier.rating,
        seats: car.seats,
        bags: car.bags,
        transmission: carTransmissions[index % carTransmissions.length],
        hasUnlimitedMileage: index % 3 !== 2,
        freeCancellation: index % 4 !== 3,
        pricePerDay,
        totalPrice: pricePerDay * days,
        currency: "USD",
      };
    });
  });
};

export default buildCarOffers;
