import Skeleton from "../ui/Skeleton";

const AttractionsSkeleton = () => {
  return (
    <div>
      <div className="h-[26rem] bg-primary-deep" />
      <div className="mx-auto mt-10 max-w-content px-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-5 h-44" />
      </div>
    </div>
  );
};

export default AttractionsSkeleton;
