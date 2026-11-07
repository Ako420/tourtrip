export type MapPlaceType = "hotel" | "attraction";

export type MapPlace = {
  id: string;
  type: MapPlaceType;
  name: string;
  city: string;
  href: string;
  price: number | string;
  currency: string;
  latitude: number;
  longitude: number;
};
