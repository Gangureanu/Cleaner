"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "./LanguageToggle";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/location", label: "Location" },
  { href: "/contact", label: "Contact" },
  { href: "/checkout", label: "Payment" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  return (
    <header
      className="siteHeader"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}
    >
      <div className="headerInner">
        <Link
          href="/"
          className="brandLink"
          aria-label="Emerald Spotless Cleaning Company home"
          onClick={() => setMenuOpen(false)}
        >
          <img src="/logo-icon.jpeg" alt="" className="brandIcon" width={48} height={43} />
          <span className="brandName">
            Emerald Spotless
            <span>Cleaning Company</span>
          </span>
        </Link>
        <div className="headerActions">
          <Link
            href="/booking"
            className="headerBooking"
            aria-current={pathname === "/booking" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </Link>
          <button
            ref={menuButton}
            className="menuButton"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="header-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d={menuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <div id="header-menu" className={`headerMenu${menuOpen ? " isOpen" : ""}`}>
          <nav className="mainNav" aria-label="Main navigation">
            {navigation.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="headerControls">
            <div className="headerPhones">
              <a href="tel:+35345870407">+353 45 870 407</a>
              <a href="tel:+353852864466">+353 85 286 4466</a>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
