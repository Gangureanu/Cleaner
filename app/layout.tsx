import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emerald Spotless | Cleaning Price Guide",
  description: "Domestic and commercial cleaning price guide for Kildare and Leinster."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
