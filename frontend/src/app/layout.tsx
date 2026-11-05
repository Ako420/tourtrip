import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";

const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-barlow" });

export const metadata: Metadata = {
  title: "Hotel Jr",
  description: "Find and book hotels for your next trip",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
