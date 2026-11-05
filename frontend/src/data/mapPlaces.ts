import type { MapPlace } from "@/types";
import attractions from "./attractions";
import hotels from "./hotels";

const SPREAD_ANGLE = 2.4;
const SPREAD_DEGREES = 0.012;

const cityCentres: Record<string, [latitude: number, longitude: number]> = {
  Agra: [27.18, 78.01],
  Bali: [-8.41, 115.19],
  Beijing: [39.9, 116.41],
  Cairo: [30.04, 31.24],
  "Cape Town": [-33.92, 18.42],
  Cappadocia: [38.64, 34.83],
  Cusco: [-13.53, -71.97],
  Dubai: [25.2, 55.27],
  "Hong Kong": [22.32, 114.17],
  Lisbon: [38.72, -9.14],
  Marrakech: [31.63, -7.99],
  Nairobi: [-1.29, 36.82],
  Paris: [48.86, 2.35],
  Phuket: [7.88, 98.39],
  Rome: [41.9, 12.5],
  Santorini: [36.39, 25.46],
  Singapore: [1.35, 103.82],
  Sydney: [-33.87, 151.21],
  "The Alps": [46.41, 11.84],
  Tokyo: [35.68, 139.69],
  Tromso: [69.65, 18.96],
};

type PlaceInput = Omit<MapPlace, "latitude" | "longitude">;

const inputs: PlaceInput[] = [
  ...hotels.map((hotel): PlaceInput => ({
    id: `hotel-${hotel.id}`,
    type: "hotel",
    name: hotel.name,
    city: hotel.city,
    href: `/hotels/${hotel.slug}`,
    price: hotel.pricePerNight,
    currency: hotel.currency,
  })),
  ...attractions.map((attraction): PlaceInput => ({
    id: `attraction-${attraction.id}`,
    type: "attraction",
    name: attraction.name,
    city: attraction.city,
    href: `/attractions/${attraction.slug}`,
    price: attraction.price,
    currency: attraction.currency,
  })),
];

// Same shape as GET /map/places. Sample places only know their city, so pins spread out around its centre.
const mapPlaces: MapPlace[] = inputs.flatMap((place, index) => {
  const centre = cityCentres[place.city];

  if (!centre) return [];

  const placesBefore = inputs.slice(0, index).filter((other) => other.city === place.city).length;
  const distance = SPREAD_DEGREES * (placesBefore + 1);

  return [
    {
      ...place,
      latitude: centre[0] + distance * Math.sin(placesBefore * SPREAD_ANGLE),
      longitude: centre[1] + distance * Math.cos(placesBefore * SPREAD_ANGLE),
    },
  ];
});

export default mapPlaces;
