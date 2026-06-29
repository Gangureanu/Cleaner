'use client';

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LanguageProvider } from "../lib/LanguageContext";
import { LanguageToggle } from "./components/LanguageToggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
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
                  <Link href="/booking">Book Now</Link>
                  <Link href="/checkout">Payment</Link>
                </nav>
                <div className="headerControls">
                  <LanguageToggle />
                  <div className="headerPhones">
                    <a href="tel:+35345870407">+353 45 870 407</a>
                    <a href="tel:+353852864466">+353 85 286 4466</a>
                  </div>
                </div>
              </div>
            </div>
          </header>

        {children}

        <footer className="siteFooter">
          <div className="footerInner">
            <img src="/logo.png" alt="Emerald Spotless logo" className="footerLogo" />
            <div className="footerContent">
              <p>Emerald Spotless Cleaning | Kildare and Leinster service coverage.</p>
              <p>
                Call us: <a href="tel:+35345870407">+353 45 870 407</a> | <a href="tel:+353852864466">+353 85 286 4466</a>
              </p>
              <p>
                Email: <a href="mailto:contact@emeraldspotless.ie">contact@emeraldspotless.ie</a>
              </p>
            </div>
          </div>
        </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
