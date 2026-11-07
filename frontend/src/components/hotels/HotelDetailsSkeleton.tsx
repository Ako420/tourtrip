import Skeleton from "../ui/Skeleton";

const HotelDetailsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-16 rounded-card" />
      <Skeleton className="mt-5 h-10 w-1/2" />
      <Skeleton className="mt-3 h-64 rounded-card sm:h-72.5" />
      <Skeleton className="mt-6 h-64 rounded-card" />
    </div>
  );
};

export default HotelDetailsSkeleton;
