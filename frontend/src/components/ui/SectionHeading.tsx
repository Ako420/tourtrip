import type { ReactNode } from "react";

type SectionHeadingProps = {
  children: ReactNode;
  action?: ReactNode;
  size?: "md" | "lg";
};

const SectionHeading = ({ children, action, size = "md" }: SectionHeadingProps) => {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className={`font-bold ${size === "lg" ? "type-section-lg" : "type-section"}`}>{children}</h2>
      {action}
    </div>
  );
};

export default SectionHeading;
