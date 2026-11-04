import type { ReactNode } from "react";

type FilterCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
};

const FilterCheckbox = ({ checked, onChange, children }: FilterCheckboxProps) => {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm transition-colors duration-300 ease-out hover:text-primary">
      <input type="checkbox" checked={checked} onChange={onChange} className="size-4 accent-primary" />
      {children}
    </label>
  );
};

export default FilterCheckbox;
