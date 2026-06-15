import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emerald Spotless Cleaning",
  description: "Domestic and commercial cleaning across Kildare and Leinster."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <div className="headerInner">
            <div className="headerTopRow">
              <Link href="/" className="brandLink" aria-label="Home">
                <img src="/logo-icon.jpeg" alt="Emerald Spotless icon" className="brandIcon" />
              </Link>
              <nav className="mainNav" aria-label="Main navigation">
                <Link href="/">Home</Link>
                <Link href="/pricing">Pricing</Link>
                <Link href="/location">Location</Link>
                <Link href="/contact">Contact</Link>
              </nav>
              <div className="headerPhones">
                <a href="tel:+35345870407">+353 45 870 407</a>
                <a href="tel:+353852864466">+353 85 286 4466</a>
              </div>
            </div>

            <div className="headerTextRow">
              <img src="/logo-text.jpeg" alt="Emerald Spotless" className="brandText" />
            </div>
          </div>
        </header>

        {children}

        <footer className="siteFooter">
          <div className="footerInner">
            <img src="/logo.jpeg" alt="Emerald Spotless logo" className="footerLogo" />
            <p>Emerald Spotless Cleaning | Kildare and Leinster service coverage.</p>
            <p>
              Call us: <a href="tel:+35345870407">+353 45 870 407</a> | <a href="tel:+353852864466">+353 85 286 4466</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
