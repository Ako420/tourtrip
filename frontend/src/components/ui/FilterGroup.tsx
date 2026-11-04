import type { ReactNode } from "react";

type FilterGroupProps = {
  title: string;
  children: ReactNode;
};

const FilterGroup = ({ title, children }: FilterGroupProps) => {
  return (
    <fieldset className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <legend className="float-left mb-2 w-full font-semibold">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
};

export default FilterGroup;
