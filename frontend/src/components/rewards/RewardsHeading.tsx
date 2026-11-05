import type { RewardsHeadingCopy } from "@/types";

type RewardsHeadingProps = {
  copy: RewardsHeadingCopy;
};

const RewardsHeading = ({ copy }: RewardsHeadingProps) => {
  return (
    <div className="mb-8 text-center">
      <p className="mx-auto w-fit rounded-sm bg-primary-soft px-2 text-xl font-bold text-primary">{copy.eyebrow}</p>
      <h2 className="mt-1 type-section-lg font-bold">{copy.title}</h2>
      {copy.note && <p className="mt-3">{copy.note}</p>}
    </div>
  );
};

export default RewardsHeading;
