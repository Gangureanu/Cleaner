import { isContactRequest } from '../../../lib/contact';
import { sendEmail } from '../../../lib/email';

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isContactRequest(payload)) {
    return Response.json(
      { error: 'Please check your name, email, service and message, then try again.' },
      { status: 400 }
    );
  }

  try {
    await sendEmail(
      'contact@emeraldspotless.ie',
      `New cleaning enquiry from ${payload.name.trim()}`,
      [
        `Name: ${payload.name.trim()}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone.trim() || 'Not provided'}`,
        `Service: ${payload.service}`,
        '',
        'Message:',
        payload.message.trim(),
      ].join('\n'),
      payload.email
    );
  } catch (error) {
    console.error('Contact enquiry email failed:', error);
    return Response.json(
      {
        error:
          'Your message could not be sent. Please try again or email contact@emeraldspotless.ie or info@emeraldspotless.ie directly.',
      },
      { status: 503 }
    );
  }

  return Response.json({ sent: true });
}
