import type { ReactNode } from "react";
import { TopNavShell } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return <TopNavShell activeHref="/attractions">{children}</TopNavShell>;
};

export default layout;
