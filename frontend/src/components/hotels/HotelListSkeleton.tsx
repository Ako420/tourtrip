import Skeleton from "../ui/Skeleton";

const HotelListSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-16" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
    </div>
  );
};

export default HotelListSkeleton;
