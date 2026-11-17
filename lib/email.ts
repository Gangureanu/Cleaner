import { Resend } from 'resend';

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  replyTo = process.env.ADMIN_BOOKING_EMAIL || 'contact@emeraldspotless.ie'
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error('Email is not configured.');
  }

  const client = new Resend(apiKey);
  const { data, error } = await client.emails.send({
    from,
    to,
    subject,
    text,
    replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data?.id) {
    throw new Error('Email provider did not confirm the message was accepted.');
  }
}
