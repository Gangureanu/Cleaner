import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Clean Spaces. Brighter Places.</p>
        <h1>A Cleaner, Healthier Environment</h1>
        <p className="summary">
          Professional cleaning services across Kildare and Leinster, with flexible
          one-off and recurring plans. Explore our pricing, service areas, and contact
          details to book your next clean.
        </p>
      </section>

      <section className="servicesStrip reveal">
        <h2 className="sectionTitle">Our Services</h2>
        <ul className="serviceChips">
          <li>Residential Cleaning</li>
          <li>Commercial Cleaning</li>
          <li>Deep Cleaning</li>
          <li>Power Washing</li>
          <li>Windows Cleaning</li>
          <li>Offices</li>
          <li>Schools</li>
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
            Kildare-based service with coverage throughout Leinster for domestic,
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
