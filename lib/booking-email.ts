import { Resend } from 'resend';
import type { Booking } from './supabase';

function getEmailSettings() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error('Booking email is not configured.');
  }

  return {
    client: new Resend(apiKey),
    from,
    replyTo: process.env.ADMIN_BOOKING_EMAIL || 'contact@emeraldspotless.ie',
  };
}

async function sendEmail(to: string, subject: string, text: string) {
  const { client, from, replyTo } = getEmailSettings();
  const { error } = await client.emails.send({
    from,
    to,
    subject,
    text,
    replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function formatBooking(booking: Booking) {
  return [
    `Service: ${booking.service_type}`,
    `Date: ${booking.preferred_date}`,
    `Time: ${booking.preferred_time.slice(0, 5)}`,
    `Duration: ${booking.hours} hour${booking.hours === 1 ? '' : 's'}`,
    `Name: ${booking.customer_name}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Address: ${booking.address}`,
    booking.notes ? `Notes: ${booking.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendNewBookingEmails(booking: Booking) {
  const adminEmail =
    process.env.ADMIN_BOOKING_EMAIL || 'contact@emeraldspotless.ie';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emeraldspotless.ie';
  const bookingDetails = formatBooking(booking);

  return Promise.allSettled([
    sendEmail(
      adminEmail,
      `New cleaning booking request from ${booking.customer_name}`,
      `A new booking request is waiting for review.\n\n${bookingDetails}\n\nReview it in the admin dashboard: ${siteUrl}/admin`
    ),
    sendEmail(
      booking.email,
      'We received your Emerald Spotless booking request',
      `Hi ${booking.customer_name},\n\nWe received your booking request. It is pending confirmation, and our team will email you once it has been reviewed.\n\n${bookingDetails}\n\nIf you have questions, reply to this email or contact contact@emeraldspotless.ie.`
    ),
  ]);
}

export async function sendBookingStatusEmail(booking: Booking) {
  if (booking.status !== 'confirmed' && booking.status !== 'cancelled') {
    return;
  }

  const subject =
    booking.status === 'confirmed'
      ? 'Your Emerald Spotless booking is confirmed'
      : 'Update about your Emerald Spotless booking';
  const outcome =
    booking.status === 'confirmed'
      ? 'Your booking has been confirmed.'
      : 'Your booking has been cancelled.';

  await sendEmail(
    booking.email,
    subject,
    `Hi ${booking.customer_name},\n\n${outcome}\n\n${formatBooking(booking)}\n\nIf you have questions, reply to this email or contact contact@emeraldspotless.ie.`
  );
}

export async function sendBookingRescheduledEmail(booking: Booking) {
  await sendEmail(
    booking.email,
    'Your Emerald Spotless booking has been rescheduled',
    `Hi ${booking.customer_name},\n\nYour booking has been rescheduled to:\n\n${formatBooking(booking)}\n\nIf you have questions, reply to this email or contact contact@emeraldspotless.ie.`
  );
}
