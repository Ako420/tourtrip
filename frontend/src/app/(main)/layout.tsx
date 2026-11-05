import type { ReactNode } from "react";
import { AppShell } from "@/components";
import { AccountNav } from "@/screens";

const layout = ({ children }: { children: ReactNode }) => {
  return <AppShell account={<AccountNav />}>{children}</AppShell>;
};

export default layout;
