import Link from "next/link";

export default function HomePage() {
  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Domestic and Commercial Cleaning</p>
        <h1>Spotless Cleaning For Homes and Businesses</h1>
        <p className="summary">
          Professional cleaning services across Kildare and Leinster, with flexible
          one-off and recurring plans. Explore our pricing, service areas, and contact
          details to book your next clean.
        </p>
      </section>

      <section className="grid threeCol">
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
      </section>

    </main>
  );
}
