type SkeletonProps = {
  className?: string;
};

const Skeleton = ({ className = "" }: SkeletonProps) => {
  return <div className={`animate-pulse rounded-card bg-surface-alt ${className}`} aria-hidden />;
};

export default Skeleton;
