import { NextResponse } from 'next/server';
import type { Booking } from '../../../lib/supabase';
import { sendNewBookingEmails } from '../../../lib/booking-email';
import { createSupabaseServerClient } from '../../../lib/supabase-server';

interface BookingRequest {
  slotId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  serviceType: string;
  hours: number;
  notes: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isBookingRequest(value: unknown): value is BookingRequest {
  if (!isRecord(value)) return false;
  return (
    typeof value.slotId === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.slotId
    ) &&
    typeof value.fullName === 'string' &&
    value.fullName.trim().length >= 2 &&
    value.fullName.length <= 120 &&
    typeof value.email === 'string' &&
    value.email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email) &&
    typeof value.phone === 'string' &&
    value.phone.trim().length >= 5 &&
    value.phone.length <= 40 &&
    typeof value.address === 'string' &&
    value.address.trim().length >= 3 &&
    value.address.length <= 300 &&
    typeof value.serviceType === 'string' &&
    value.serviceType.trim().length >= 2 &&
    value.serviceType.length <= 100 &&
    typeof value.hours === 'number' &&
    Number.isFinite(value.hours) &&
    value.hours >= 1 &&
    value.hours <= 8 &&
    typeof value.notes === 'string' &&
    value.notes.length <= 1000
  );
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isBookingRequest(payload)) {
    return NextResponse.json(
      { error: 'Please check the booking details and try again.' },
      { status: 400 }
    );
  }

  let supabase: ReturnType<typeof createSupabaseServerClient>;
  try {
    supabase = createSupabaseServerClient();
  } catch (error) {
    console.error('Booking database configuration error:', error);
    return NextResponse.json(
      { error: 'Online booking is temporarily unavailable. Please call us.' },
      { status: 503 }
    );
  }

  const { data, error } = await supabase.rpc('create_booking', {
    p_slot_id: payload.slotId,
    p_customer_name: payload.fullName,
    p_email: payload.email,
    p_phone: payload.phone,
    p_address: payload.address,
    p_service_type: payload.serviceType,
    p_hours: payload.hours,
    p_notes: payload.notes,
  });

  if (error) {
    console.error('Booking creation failed:', error);
    const status = error.code === 'P0001' ? 409 : error.code === '22023' ? 400 : 503;
    return NextResponse.json(
      {
        error:
          status === 409
            ? 'That appointment is no longer available. Please choose another time.'
            : status === 400
              ? 'Please check the booking details and try again.'
              : 'We could not save your booking. Please try again or call us.',
      },
      { status }
    );
  }

  if (!data) {
    console.error('Booking creation returned no booking data.');
    return NextResponse.json(
      { error: 'We could not confirm the booking. Please call us before trying again.' },
      { status: 503 }
    );
  }

  const booking: Booking = data;
  const emailResults = await sendNewBookingEmails(booking);
  const notifications = {
    admin: emailResults[0].status === 'fulfilled',
    customer: emailResults[1].status === 'fulfilled',
  };
  const failedRecipients = [
    notifications.admin ? null : 'admin',
    notifications.customer ? null : 'customer',
  ].filter((recipient): recipient is string => recipient !== null);

  if (failedRecipients.length > 0) {
    emailResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(
          `${index === 0 ? 'Admin' : 'Customer'} booking email failed:`,
          result.reason
        );
      }
    });
  }

  return NextResponse.json(
    {
      bookingId: booking.id,
      notifications,
      warning:
        failedRecipients.length > 0
          ? `Your request was saved, but the ${failedRecipients.join(' and ')} email could not be sent. Please call us to confirm it was received.`
          : null,
    },
    { status: 201 }
  );
}
