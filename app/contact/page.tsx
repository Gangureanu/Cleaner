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
          <p>
            Email: <a className="phoneLink" href="mailto:contact@emeraldspotless.ie">contact@emeraldspotless.ie</a>
          </p>
        </article>

        <article className="panelCard reveal">
          <h3>Hours</h3>
          <p>Monday to Saturday</p>
          <p>08:00 - 19:00</p>
          <p>Sunday by prior arrangement</p>
        </article>
      </section>

      <section className="contactFormWrap reveal">
        <article className="panelCard">
          <h3>Send Us A Message</h3>
          <form
            className="contactForm"
            action="mailto:contact@emeraldspotless.ie"
            method="post"
            encType="text/plain"
          >
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />

            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" />

            <label htmlFor="service">Service Needed</label>
            <select id="service" name="service" defaultValue="Standard Cleaning">
              <option>Standard Cleaning</option>
              <option>Deep Cleaning</option>
              <option>Move-In / Move-Out Cleaning</option>
              <option>Weekly / Bi-weekly Cleaning</option>
              <option>Commercial Cleaning</option>
            </select>

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="Tell us your property size, preferred dates, and what you want cleaned."
            />

            <button type="submit">Send Enquiry</button>
          </form>
        </article>
      </section>
    </main>
  );
}
