import Link from "next/link";
import type { ComponentProps } from "react";
import { getButtonClass, type ButtonStyle } from "./buttonStyles";

const ButtonLink = ({ variant, size, className, ...props }: ButtonStyle & ComponentProps<typeof Link>) => {
  return <Link className={getButtonClass({ variant, size }, className)} {...props} />;
};

export default ButtonLink;
