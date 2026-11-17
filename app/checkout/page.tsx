'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BookingResponse {
  bookingId?: string;
  notifications?: { admin: boolean; customer: boolean };
  warning?: string | null;
  error?: string;
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    address: '',
    serviceType: 'Standard Cleaning',
    hours: '2',
    date: '',
    time: '',
    notes: '',
  });
  const [slotId, setSlotId] = useState<string | null>(null);
  const [bookingDetailsReady, setBookingDetailsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    bookingId: string;
    warning: string | null;
  } | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setSlotId(query.get('slotId'));
    setFormData((previous) => ({
      ...previous,
      serviceType: query.get('serviceType') || previous.serviceType,
      date: query.get('date') || '',
      time: query.get('time') || '',
    }));
    setBookingDetailsReady(true);
  }, []);

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
    setSubmitError(null);
    if (!slotId) {
      setSubmitError('Please choose an available appointment before submitting.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          serviceType: formData.serviceType,
          hours: Number(formData.hours),
          notes: formData.notes,
        }),
      });
      const result = (await response.json()) as BookingResponse;

      if (!response.ok || !result.bookingId) {
        throw new Error(result.error || 'We could not save your booking. Please try again.');
      }

      setConfirmation({
        bookingId: result.bookingId,
        warning: result.warning ?? null,
      });
    } catch (error) {
      console.error('Booking submission failed:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'We could not save your booking. Please try again or call us.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Booking Request</p>
        <h1>Complete Your Booking</h1>
        <p className="summary">
          Send your booking request and our team will email you after reviewing the
          appointment.
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
                  <option>Carpet Cleaning</option>
                  <option>Power Washing</option>
                  <option>Windows Cleaning</option>
                  <option>Offices</option>
                  <option>Schools</option>
                </select>
              </div>
              <div className="formField">
                <label htmlFor="date">Preferred Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  readOnly
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="formRow">
              <div className="formField">
                <label htmlFor="time">Preferred Time *</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  required
                  readOnly
                  value={formData.time}
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
                <span>Estimated Total:</span>
                <strong>EUR {totalCost.toFixed(2)}</strong>
              </div>
            </div>

            {!slotId && bookingDetailsReady && (
              <p className="formNote" role="alert">
                Start by choosing an available appointment on the{' '}
                <Link href="/booking">booking calendar</Link>.
              </p>
            )}

            {submitError && (
              <p className="bookingError" role="alert">
                {submitError}
              </p>
            )}

            {confirmation && (
              <div className="bookingSuccess" role="status">
                <h4>Booking request received</h4>
                <p>Reference: {confirmation.bookingId}</p>
                <p>
                  {confirmation.warning ||
                    'We emailed you a receipt. Our team will email you after reviewing your request.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing || !bookingDetailsReady || !slotId || !!confirmation}
              className="submitBtn"
            >
              {isProcessing ? 'Sending request…' : 'Send Booking Request'}
            </button>

            <p className="formNote">
              Your appointment is not confirmed until our team contacts you.
            </p>
          </form>
        </article>
      </section>

      <section className="infoSection reveal">
        <h3>After You Submit</h3>
        <p>
          We will email you to confirm or cancel the appointment. Payment details
          will be arranged after the booking is reviewed.
        </p>
        <Link href="/pricing" className="ctaLink">
          View all pricing
        </Link>
      </section>
    </main>
  );
}
