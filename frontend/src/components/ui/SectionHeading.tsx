import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  action?: ReactNode;
};

const SectionHeading = ({ children, action }: SectionHeadingProps) => {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-bold sm:text-[1.75rem]">{children}</h2>
      {action}
    </div>
  );
};

export default SectionHeading;
