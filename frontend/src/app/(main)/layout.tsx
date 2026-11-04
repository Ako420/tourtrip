import type { ReactNode } from "react";
import { AppShell } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return <AppShell>{children}</AppShell>;
};

export default layout;
