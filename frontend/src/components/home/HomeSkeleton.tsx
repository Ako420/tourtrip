import Skeleton from "../ui/Skeleton";

const HomeSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-[25rem] rounded-panel" />
      <Skeleton className="mx-auto mt-12 h-40 max-w-content" />
    </div>
  );
};

export default HomeSkeleton;
