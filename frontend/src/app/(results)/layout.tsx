import type { ReactNode } from "react";
import { AppShell } from "@/components";

const layout = ({ children }: { children: ReactNode }) => {
  return <AppShell hasSidebar={false}>{children}</AppShell>;
};

export default layout;
