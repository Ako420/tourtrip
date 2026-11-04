import Skeleton from "../ui/Skeleton";

const FlightResultsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-44" />
      <Skeleton className="h-16" />
      <Skeleton className="h-36" />
      <Skeleton className="h-36" />
    </div>
  );
};

export default FlightResultsSkeleton;
