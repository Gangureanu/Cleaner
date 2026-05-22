import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cleaner",
  description: "Work in progress"
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
