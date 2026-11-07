import type { ReactNode } from "react";
import { TopNavShell } from "@/components";
import { AccountNav } from "@/screens";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <TopNavShell activeHref="/rewards" account={<AccountNav variant="inverse" />}>
      {children}
    </TopNavShell>
  );
};

export default layout;
