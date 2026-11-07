"use client";

import { useState, type ReactNode } from "react";
import FloatingActions from "./FloatingActions";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type AppShellProps = {
  hasSidebar?: boolean;
  account?: ReactNode;
  children: ReactNode;
};

const isDrawerLayout = () => window.matchMedia("(max-width: 63.999rem)").matches;

const AppShell = ({ hasSidebar = true, account, children }: AppShellProps) => {
  // On small screens this opens the drawer. On large screens it collapses the sidebar to icons.
  const [isToggled, setIsToggled] = useState(false);

  return (
    <>
      <Navbar onMenuClick={hasSidebar ? () => setIsToggled((current) => !current) : undefined} account={account} />

      <div className="flex flex-1">
        {hasSidebar && (
          <Sidebar
            isToggled={isToggled}
            onNavigate={() => {
              if (isDrawerLayout()) setIsToggled(false);
            }}
          />
        )}

        {isToggled && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsToggled(false)}
            className="fixed inset-0 top-navbar z-20 bg-ink/40 lg:hidden"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-4 py-4 lg:px-8 lg:py-8">{children}</main>
          <Footer />
        </div>
      </div>

      <FloatingActions />
    </>
  );
};

export default AppShell;
