import { Suspense } from "react";
import { MapExplorer, Skeleton } from "@/components";
import { getMapPlaces } from "@/services";

const MapContent = async () => {
  return <MapExplorer places={await getMapPlaces()} />;
};

const MapScreen = () => {
  return (
    <div className="pb-8">
      <h1 className="type-page font-bold">Explore the map</h1>
      <p className="mt-1 mb-4 text-sm text-muted">Sample places shown by city. Pins are approximate.</p>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <MapContent />
      </Suspense>
    </div>
  );
};

export default MapScreen;
