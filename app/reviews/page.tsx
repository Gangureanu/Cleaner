import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Share your experience with Emerald Spotless Cleaning Company or visit Trustpilot, the independent review platform.",
  alternates: {
    canonical: "/reviews",
  },
};

export default function ReviewsPage() {
  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Your Feedback Matters</p>
        <h1>Reviews</h1>
        <p className="summary">
          Have we cleaned your home or business? We would love to hear about your
          experience with Emerald Spotless Cleaning Company.
        </p>
      </section>

      <section className="grid twoCol">
        <article className="panelCard reveal">
          <h2 className="sectionTitle">Trustpilot</h2>
          <p>
            Trustpilot is an independent review platform. We do not have a
            business profile there yet, so the link below takes you to the
            general Trustpilot website, not to reviews of Emerald Spotless.
          </p>
          <a href="https://www.trustpilot.com/" className="ctaLink">
            Visit Trustpilot
          </a>
        </article>

        <article className="panelCard reveal">
          <h2 className="sectionTitle">Share Your Experience</h2>
          <p>
            In the meantime, you can send feedback directly to our team. Tell us
            what went well or how we can improve your next clean.
          </p>
          <Link href="/contact" className="ctaLink">
            Send Us Feedback
          </Link>
        </article>
      </section>
    </main>
  );
}
