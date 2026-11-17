import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Clean Spaces. Brighter Places.</p>
        <h1>A Cleaner, Healthier Environment</h1>
        <p className="summary">
          Professional cleaning services across Dublin, Co. Kildare and surrounding areas, with flexible
          one-off and recurring plans. Explore our pricing, service areas, and contact
          details to book your next clean.
        </p>
      </section>

      <section className="servicesStrip reveal">
        <h2 className="sectionTitle">Our Services</h2>
        <ul className="serviceGrid">
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1z" />
              </svg>
            </span>
            <span>Residential Cleaning</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18m-11 0v2h4v-2" />
              </svg>
            </span>
            <span>Commercial Cleaning</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" />
                <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15ZM5 3l.7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8-1.8-.7 1.8-.7L5 3Z" />
              </svg>
            </span>
            <span>Deep Cleaning</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="m4 20 11-11m-2-2 4-4 4 4-4 4M5 8c0 1.2-.9 2.2-2 2.2S1 9.2 1 8s2-3.5 2-3.5S5 6.8 5 8Zm16 6c0 1.2-.9 2.2-2 2.2S17 15.2 17 14s2-3.5 2-3.5 2 2.3 2 3.5Z" />
              </svg>
            </span>
            <span>Power Washing</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 3v18M3 12h18" />
              </svg>
            </span>
            <span>Windows Cleaning</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 21V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v17M2 21h20M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2m-5 6v-4h3v4" />
              </svg>
            </span>
            <span>Offices</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6M9 10h.01M15 10h.01M12 10h.01" />
              </svg>
            </span>
            <span>Schools</span>
          </li>
          <li className="serviceItem">
            <span className="serviceIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="14" height="16" rx="1" />
                <path d="M6 8h8M6 12h8M6 16h8M17 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
              </svg>
            </span>
            <span>Carpet Cleaning</span>
          </li>
        </ul>
      </section>

      <section className="grid twoCol">
        <article className="panelCard reveal">
          <h3>Pricing</h3>
          <p>
            Transparent hourly and flat-rate estimates for standard, deep, move-in/out,
            and add-on cleaning services.
          </p>
          <Link href="/pricing" className="ctaLink">
            View pricing
          </Link>
        </article>

        <article className="panelCard reveal">
          <h3>Location</h3>
          <p>
            Serving Dublin, Co. Kildare and surrounding areas for domestic,
            commercial, and private property cleaning.
          </p>
          <Link href="/location" className="ctaLink">
            See service area
          </Link>
        </article>

        <article className="panelCard reveal">
          <h3>Contact</h3>
          <p>
            Speak directly with our team for availability, custom checklists, and same
            week quote support.
          </p>
          <Link href="/contact" className="ctaLink">
            Get in touch
          </Link>
        </article>

        <article className="panelCard reveal">
          <h3>Book Now</h3>
          <p>
            Use our booking calendar to choose your service, date, and preferred
            timeslot before checkout.
          </p>
          <Link href="/booking" className="ctaLink">
            Start booking
          </Link>
        </article>
      </section>

      <section className="trustStrip reveal">
        <div className="trustItem">
          <span className="trustIcon" aria-hidden="true">🛡️</span>
          <p>Fully Insured &amp; Reliable</p>
        </div>
        <div className="trustItem">
          <span className="trustIcon" aria-hidden="true">🌿</span>
          <p>Eco-Friendly Products</p>
        </div>
        <div className="trustItem">
          <span className="trustIcon" aria-hidden="true">👥</span>
          <p>Professional Team</p>
        </div>
        <div className="trustItem">
          <span className="trustIcon" aria-hidden="true">✅</span>
          <p>Quality Guaranteed</p>
        </div>
      </section>

      <section className="quoteBanner reveal">
        <h2>Get A Free Quote Today!</h2>
        <p>
          Call <a href="tel:+353852864466">085 286 4466</a> or book online for a
          same-week quote.
        </p>
        <Link href="/contact" className="ctaLink">
          Get a free quote
        </Link>
      </section>

    </main>
  );
}
