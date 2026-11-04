import type { ComponentProps } from "react";
import { getButtonClass, type ButtonStyle } from "./buttonStyles";

const Button = ({ variant, size, className, ...props }: ButtonStyle & ComponentProps<"button">) => {
  return <button className={getButtonClass({ variant, size }, className)} {...props} />;
};

export default Button;
