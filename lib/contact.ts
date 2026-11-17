export const contactServices = [
  'Standard Cleaning',
  'Deep Cleaning',
  'Move-In / Move-Out Cleaning',
  'Weekly / Bi-weekly Cleaning',
  'Commercial Cleaning',
  'Power Washing',
  'Windows Cleaning',
  'Office Cleaning',
  'School Cleaning',
];

export interface ContactRequest {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export function isContactRequest(value: unknown): value is ContactRequest {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.name === 'string' &&
    payload.name.trim().length >= 2 &&
    payload.name.length <= 120 &&
    !/[\r\n]/.test(payload.name) &&
    typeof payload.email === 'string' &&
    payload.email.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(payload.email) &&
    typeof payload.phone === 'string' &&
    payload.phone.length <= 40 &&
    !/[\r\n]/.test(payload.phone) &&
    typeof payload.service === 'string' &&
    contactServices.includes(payload.service) &&
    typeof payload.message === 'string' &&
    payload.message.trim().length > 0 &&
    payload.message.length <= 5000
  );
}
