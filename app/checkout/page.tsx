'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    serviceType: 'Standard Cleaning',
    hours: '2',
    date: '',
    notes: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const hourlyRate = 27.5; // EUR 25-30 average
  const totalCost = parseFloat(formData.hours) * hourlyRate;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // This would normally redirect to Stripe checkout
    // For now, we'll show a confirmation message
    console.log('Booking submitted:', formData);
    alert(
      `Booking for ${formData.fullName}\nService: ${formData.serviceType}\nDate: ${formData.date}\nTotal: EUR ${totalCost.toFixed(2)}\n\nRedirecting to Stripe payment...`
    );

    // In production, this would call your backend API to create a Stripe session
    // await fetch('/api/checkout', { method: 'POST', body: JSON.stringify(formData) })
  };

  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Secure Payment</p>
        <h1>Book & Pay Online</h1>
        <p className="summary">
          Complete your booking and pay securely with Stripe. Choose your service,
          date, and complete payment in just a few steps.
        </p>
      </section>

      <section className="checkoutWrap reveal">
        <article className="panelCard">
          <h3>Booking Details</h3>
          <form className="checkoutForm" onSubmit={handleSubmit}>
            <div className="formRow">
              <div className="formField">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>
              <div className="formField">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="formRow">
              <div className="formField">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+353 XX XXX XXXX"
                />
              </div>
              <div className="formField">
                <label htmlFor="address">Address *</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your cleaning location"
                />
              </div>
            </div>

            <div className="formRow">
              <div className="formField">
                <label htmlFor="serviceType">Service Type *</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                >
                  <option>Standard Cleaning</option>
                  <option>Deep Cleaning</option>
                  <option>Move-In / Move-Out Cleaning</option>
                  <option>Weekly Maintenance</option>
                  <option>Commercial Cleaning</option>
                </select>
              </div>
              <div className="formField">
                <label htmlFor="date">Preferred Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="formRow">
              <div className="formField">
                <label htmlFor="hours">Hours Required *</label>
                <select
                  id="hours"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="5">5 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours (Full day)</option>
                </select>
              </div>
              <div className="formField">
                <label htmlFor="notes">Special Requests</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions or areas of focus"
                  rows={2}
                />
              </div>
            </div>

            <div className="costSummary">
              <div className="costRow">
                <span>Hourly Rate:</span>
                <strong>EUR {hourlyRate.toFixed(2)}</strong>
              </div>
              <div className="costRow">
                <span>Hours:</span>
                <strong>{formData.hours}</strong>
              </div>
              <div className="costRowTotal">
                <span>Total Cost:</span>
                <strong>EUR {totalCost.toFixed(2)}</strong>
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="submitBtn">
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <p className="formNote">
              You will be redirected to Stripe to complete your secure payment.
              We accept all major credit and debit cards.
            </p>
          </form>
        </article>
      </section>

      <section className="infoSection reveal">
        <h3>Secure Payment Information</h3>
        <p>
          All payments are processed securely through Stripe. Your payment
          information is never stored on our servers. A confirmation email with
          booking details will be sent immediately after payment.
        </p>
        <Link href="/pricing" className="ctaLink">
          View all pricing
        </Link>
      </section>
    </main>
  );
}
