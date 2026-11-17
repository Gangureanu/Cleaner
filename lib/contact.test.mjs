import assert from 'node:assert/strict';
import test from 'node:test';
import { isContactRequest } from './contact.ts';
import { sendEmail } from './email.ts';

const enquiry = {
  name: 'Test Customer',
  email: 'customer@example.com',
  phone: '',
  service: 'Standard Cleaning',
  message: 'Please quote for a regular clean.\nThank you.',
};

test('accepts a contact enquiry with an optional phone and multiline message', () => {
  assert.equal(isContactRequest(enquiry), true);
});

test('rejects invalid enquiries and email-header injection', () => {
  for (const payload of [
    null,
    [],
    { ...enquiry, name: ' ' },
    { ...enquiry, name: 'Customer\r\nBcc: other@example.com' },
    { ...enquiry, email: 'invalid' },
    { ...enquiry, email: 'customer@example.com\nother@example.com' },
    { ...enquiry, message: ' \n ' },
    { ...enquiry, message: 'a'.repeat(5001) },
    { ...enquiry, phone: '1'.repeat(41) },
    { ...enquiry, service: 'Unlisted service' },
  ]) {
    assert.equal(isContactRequest(payload), false);
  }
});

function configureEmail(t) {
  const keys = ['RESEND_API_KEY', 'BOOKING_FROM_EMAIL', 'ADMIN_BOOKING_EMAIL'];
  const previous = keys.map((key) => process.env[key]);
  process.env.RESEND_API_KEY = 're_test_only';
  process.env.BOOKING_FROM_EMAIL = 'Test Sender <sender@example.com>';
  process.env.ADMIN_BOOKING_EMAIL = 'admin@example.com';
  t.after(() => {
    keys.forEach((key, index) => {
      if (previous[index] === undefined) delete process.env[key];
      else process.env[key] = previous[index];
    });
  });
}

test('sends through the verified sender with visitor Reply-To and preserves booking defaults', async (t) => {
  configureEmail(t);
  const emails = [];
  t.mock.method(globalThis, 'fetch', async (_url, options) => {
    emails.push(JSON.parse(options.body));
    return Response.json({ id: 'test-message-id' });
  });

  await sendEmail('contact@example.com', 'Enquiry', enquiry.message, enquiry.email);
  await sendEmail('customer@example.com', 'Booking update', 'Booking details');

  assert.deepEqual(emails[0], {
    from: 'Test Sender <sender@example.com>',
    to: 'contact@example.com',
    subject: 'Enquiry',
    text: enquiry.message,
    reply_to: enquiry.email,
  });
  assert.equal(emails[1].reply_to, 'admin@example.com');
});

test('surfaces provider rejection or missing acceptance instead of reporting success', async (t) => {
  configureEmail(t);
  const fetchMock = t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ name: 'validation_error', message: 'Sender not verified' }, { status: 403 })
  );
  await assert.rejects(sendEmail('contact@example.com', 'Enquiry', 'Message'), /Sender not verified/);

  fetchMock.mock.mockImplementation(async () => Response.json({}));
  await assert.rejects(sendEmail('contact@example.com', 'Enquiry', 'Message'), /did not confirm/);
});

test('missing configuration fails before attempting email delivery', async (t) => {
  configureEmail(t);
  delete process.env.RESEND_API_KEY;
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Must not contact provider');
  });
  await assert.rejects(sendEmail('contact@example.com', 'Enquiry', 'Message'), /not configured/);
  assert.equal(fetchMock.mock.callCount(), 0);
});
