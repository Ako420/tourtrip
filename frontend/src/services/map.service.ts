import { mapPlaces } from "@/data";
import type { MapPlace } from "@/types";
import { apiGet, isApiLive } from "./http";

export const getMapPlaces = async (): Promise<MapPlace[]> => {
  return isApiLive("map") ? apiGet<MapPlace[]>("/map/places") : mapPlaces;
};
