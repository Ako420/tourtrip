import Skeleton from "../ui/Skeleton";

const HotelDetailsSkeleton = () => {
  return (
    <div>
      <Skeleton className="aspect-[21/8] rounded-panel" />
      <Skeleton className="mt-5 h-8 w-1/2" />
      <Skeleton className="mt-3 h-24" />
    </div>
  );
};

export default HotelDetailsSkeleton;
