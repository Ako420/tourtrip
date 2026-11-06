import type { ReactNode } from "react";

type FilterGroupProps = {
  title: string;
  children: ReactNode;
  small?: boolean;
};

const FilterGroup = ({ title, children, small = false }: FilterGroupProps) => {
  return (
    <fieldset className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <legend className={`float-left mb-2 w-full font-bold ${small ? "text-sm" : ""}`}>{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
};

export default FilterGroup;
