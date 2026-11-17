import { NextResponse } from 'next/server';
import type { Booking, BookingStatus, PaymentStatus } from '../../../../lib/supabase';
import {
  sendBookingRescheduledEmail,
  sendBookingStatusEmail,
} from '../../../../lib/booking-email';
import { createSupabaseServerClient } from '../../../../lib/supabase-server';

interface AdminBookingUpdate {
  bookingId: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  slotId?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAdminBookingUpdate(value: unknown): value is AdminBookingUpdate {
  if (!isRecord(value) || typeof value.bookingId !== 'string') return false;
  if (
    value.status !== undefined &&
    !['pending', 'confirmed', 'cancelled', 'completed'].includes(
      String(value.status)
    )
  ) {
    return false;
  }
  if (
    value.paymentStatus !== undefined &&
    !['pending', 'paid', 'refunded'].includes(String(value.paymentStatus))
  ) {
    return false;
  }
  if (value.slotId !== undefined && typeof value.slotId !== 'string') {
    return false;
  }
  return (
    value.status !== undefined ||
    value.paymentStatus !== undefined ||
    value.slotId !== undefined
  );
}

export async function PATCH(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return NextResponse.json({ error: 'Please sign in as an admin.' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!isAdminBookingUpdate(payload)) {
    return NextResponse.json({ error: 'Invalid booking update.' }, { status: 400 });
  }

  let supabase: ReturnType<typeof createSupabaseServerClient>;
  try {
    supabase = createSupabaseServerClient(token);
  } catch (error) {
    console.error('Admin database configuration error:', error);
    return NextResponse.json(
      { error: 'The booking dashboard is not configured.' },
      { status: 503 }
    );
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: 'Your admin session has expired.' }, { status: 401 });
  }

  const { data: membership, error: membershipError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (membershipError) {
    console.error('Admin access check failed:', membershipError);
    return NextResponse.json(
      { error: 'Could not verify admin access.' },
      { status: 503 }
    );
  }
  if (!membership) {
    return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
  }

  const { data: currentBooking, error: currentError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', payload.bookingId)
    .maybeSingle();

  if (currentError) {
    console.error('Booking lookup failed:', currentError);
    return NextResponse.json({ error: 'Could not load this booking.' }, { status: 503 });
  }
  if (!currentBooking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }

  const allowedStatusTransitions: Record<Booking['status'], Booking['status'][]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['cancelled', 'completed'],
    cancelled: [],
    completed: [],
  };
  if (
    payload.status !== undefined &&
    payload.status !== currentBooking.status &&
    !allowedStatusTransitions[currentBooking.status].includes(payload.status)
  ) {
    return NextResponse.json(
      { error: 'This booking status cannot be changed to the selected status.' },
      { status: 409 }
    );
  }

  let updatedBooking: Booking = currentBooking;

  if (payload.slotId !== undefined) {
    const { error } = await supabase.rpc('admin_reschedule_booking', {
      p_booking_id: payload.bookingId,
      p_slot_id: payload.slotId,
    });
    if (error) {
      console.error('Booking reschedule failed:', error);
      return NextResponse.json(
        {
          error:
            error.code === 'P0001'
              ? 'That appointment is no longer available.'
              : 'Could not reschedule this booking.',
        },
        { status: error.code === 'P0001' ? 409 : 503 }
      );
    }
  }

  if (payload.status !== undefined || payload.paymentStatus !== undefined) {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        ...(payload.status === undefined ? {} : { status: payload.status }),
        ...(payload.paymentStatus === undefined
          ? {}
          : { payment_status: payload.paymentStatus }),
      })
      .eq('id', payload.bookingId)
      .select('*')
      .single();

    if (error) {
      console.error('Booking update failed:', error);
      return NextResponse.json(
        { error: 'Could not save this booking update.' },
        { status: 503 }
      );
    }
    updatedBooking = data;
  } else if (payload.slotId !== undefined) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', payload.bookingId)
      .single();
    if (error) {
      console.error('Updated booking lookup failed:', error);
      return NextResponse.json(
        { error: 'The booking was rescheduled, but its details could not be reloaded.' },
        { status: 503 }
      );
    }
    updatedBooking = data;
  }

  let emailWarning: string | null = null;
  try {
    if (
      payload.status !== undefined &&
      payload.status !== currentBooking.status &&
      (payload.status === 'confirmed' || payload.status === 'cancelled')
    ) {
      await sendBookingStatusEmail(updatedBooking);
    } else if (
      payload.slotId !== undefined &&
      payload.slotId !== currentBooking.slot_id
    ) {
      await sendBookingRescheduledEmail(updatedBooking);
    }
  } catch (error) {
    console.error('Customer booking update email failed:', error);
    emailWarning =
      'The booking was updated, but the customer email could not be sent.';
  }

  return NextResponse.json({ booking: updatedBooking, emailWarning });
}
