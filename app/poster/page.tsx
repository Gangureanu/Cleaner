'use client';

import { useEffect, useState } from "react";

export default function PosterPage() {
  const [siteUrl, setSiteUrl] = useState("https://example.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(siteUrl)}`;

  return (
    <main className="posterPage">
      <article className="posterSheet">
        <img src="/logo.png" alt="Emerald Spotless" className="posterLogo" />

        <p className="posterKicker">Domestic and Commercial Cleaning</p>
        <h1 className="posterTitle">Book Your Cleaning Today</h1>

        <p className="posterText">
          Scan the QR code to visit our website and view pricing, location, and contact details.
        </p>

        <a href={siteUrl} className="posterQrLink" target="_blank" rel="noreferrer">
          <img src={qrUrl} alt="QR code linking to website" className="posterQr" />
        </a>

        <p className="posterSiteUrl">{siteUrl}</p>

        <section className="posterContacts">
          <h2>Contact</h2>
          <p>
            Phone: <a href="tel:+35345870407">+353 45 870 407</a>
          </p>
          <p>
            Phone: <a href="tel:+353852864466">+353 85 286 4466</a>
          </p>
          <p>
            Email: <a href="mailto:info@emeraldspotless.ie">info@emeraldspotless.ie</a>
          </p>
        </section>
      </article>
    </main>
  );
}
