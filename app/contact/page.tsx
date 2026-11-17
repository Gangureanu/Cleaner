"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { contactServices } from "../../lib/contact";

export default function ContactPage() {
  const submitting = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    submitting.current = true;
    setIsSending(true);
    setSubmitError("");
    setSent(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          phone: String(formData.get("phone") || "").trim(),
          service: String(formData.get("service") || ""),
          message: String(formData.get("message") || "").trim(),
        }),
      });
      const result: { sent?: boolean; error?: string } = await response.json();
      if (!response.ok || result.sent !== true) {
        throw new Error(result.error || "Your message could not be sent. Please try again.");
      }

      setSent(true);
      form.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again or call us."
      );
    } finally {
      submitting.current = false;
      setIsSending(false);
    }
  }

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

      <section className="grid threeCol">
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
          <p>
            Email: <a className="phoneLink" href="mailto:info@emeraldspotless.ie">info@emeraldspotless.ie</a>
          </p>
        </article>

        <article className="panelCard reveal">
          <h3>Address</h3>
          <p>Emerald Spotless</p>
          <p>Brockagh, Robertstown</p>
          <p>Naas, Co Kildare</p>
          <p>W91 C7RF</p>
        </article>

        <article className="panelCard reveal hoursCard">
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
            onSubmit={handleSubmit}
            aria-busy={isSending}
          >
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" type="text" minLength={2} maxLength={120} required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" maxLength={254} required />

            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" maxLength={40} />

            <label htmlFor="service">Service Needed</label>
            <select id="service" name="service" defaultValue="Standard Cleaning">
              {contactServices.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              maxLength={5000}
              required
              placeholder="Tell us your property size, preferred dates, and what you want cleaned."
            />

            <button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Enquiry"}
            </button>
            {submitError ? <p role="alert">{submitError}</p> : null}
            {sent ? (
              <p role="status">Thank you! Your enquiry has been sent to our team.</p>
            ) : null}
          </form>
        </article>
      </section>
    </main>
  );
}
