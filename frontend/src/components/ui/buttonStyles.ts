const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variantClass = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  ghost: "text-ink hover:bg-surface-alt",
  inverse: "bg-surface text-ink hover:bg-primary-soft",
  outline: "border border-primary text-primary hover:bg-primary-soft",
};

const sizeClass = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export type ButtonStyle = {
  variant?: keyof typeof variantClass;
  size?: keyof typeof sizeClass;
};

export const getButtonClass = ({ variant = "primary", size = "md" }: ButtonStyle, className = "") => {
  return `${baseClass} ${variantClass[variant]} ${sizeClass[size]} ${className}`;
};
