export default function ContactPage() {
  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Get In Touch</p>
        <h1>Contact Emerald Spotless</h1>
        <p className="summary">
          Call us directly for bookings, site visits, recurring plans, and custom
          checklists for homes, businesses, and community spaces.
        </p>
      </section>

      <section className="grid twoCol">
        <article className="panelCard reveal">
          <h3>Phone Numbers</h3>
          <p>
            <a className="phoneLink" href="tel:+35345870407">
              +353 45 870 407
            </a>
          </p>
          <p>
            <a className="phoneLink" href="tel:+353852864466">
              +353 85 286 4466
            </a>
          </p>
        </article>

        <article className="panelCard reveal">
          <h3>Hours</h3>
          <p>Monday to Saturday</p>
          <p>08:00 - 19:00</p>
          <p>Sunday by prior arrangement</p>
        </article>
      </section>
    </main>
  );
}
