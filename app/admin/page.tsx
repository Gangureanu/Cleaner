'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { AvailabilitySlot, Booking, PaymentStatus } from '../../lib/supabase';
import { getSupabaseClient } from '../../lib/supabase';
import { formatSlotTime, getSlotDates, getSlotDuration } from '../../lib/availability';

interface AdminApiResponse {
  booking?: Booking;
  emailWarning?: string | null;
  error?: string;
}

function todayDateKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function formatBookingDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function isPaymentStatus(value: string): value is PaymentStatus {
  return value === 'pending' || value === 'paid' || value === 'refunded';
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [slotDate, setSlotDate] = useState('');
  const [slotEndDate, setSlotEndDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [isSavingSlot, setIsSavingSlot] = useState(false);
  const [rescheduleSelections, setRescheduleSelections] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    let active = true;
    let loadedUserId: string | null = null;

    const loadDashboard = async (activeSession: Session) => {
      setIsLoading(true);
      setDashboardError(null);
      try {
        const supabase = getSupabaseClient();
        const { data: membership, error: membershipError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', activeSession.user.id)
          .maybeSingle();

        if (membershipError) throw membershipError;
        if (!membership) {
          if (active && loadedUserId === activeSession.user.id) {
            setIsAdmin(false);
            setBookings([]);
            setSlots([]);
          }
          return;
        }

        const [bookingResult, slotResult] = await Promise.all([
          supabase
            .from('bookings')
            .select('*')
            .order('preferred_date')
            .order('preferred_time'),
          supabase
            .from('availability_slots')
            .select('*')
            .order('slot_date')
            .order('slot_time'),
        ]);

        if (bookingResult.error) throw bookingResult.error;
        if (slotResult.error) throw slotResult.error;
        if (active && loadedUserId === activeSession.user.id) {
          setIsAdmin(true);
          setBookings(bookingResult.data);
          setSlots(slotResult.data);
        }
      } catch (error) {
        console.error('Could not load the admin dashboard:', error);
        if (active) {
          setDashboardError(
            error instanceof Error
              ? error.message
              : 'Could not load the dashboard. Please try again.'
          );
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    const updateSession = (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      setAuthReady(true);
      setDashboardError(null);
      if (!nextSession) {
        loadedUserId = null;
        setIsAdmin(false);
        setBookings([]);
        setSlots([]);
        setIsLoading(false);
        return;
      }
      if (loadedUserId !== nextSession.user.id) {
        loadedUserId = nextSession.user.id;
        void loadDashboard(nextSession);
      }
    };

    try {
      const supabase = getSupabaseClient();
      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        updateSession(nextSession);
      });

      void supabase.auth
        .getSession()
        .then(({ data: sessionData, error }) => {
          if (error) throw error;
          updateSession(sessionData.session);
        })
        .catch((error: unknown) => {
          console.error('Could not check the admin session:', error);
          if (active) {
            setDashboardError('Could not check your admin session. Please refresh.');
            setIsLoading(false);
            setAuthReady(true);
          }
        });

      return () => {
        active = false;
        data.subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Supabase is not configured for the admin dashboard:', error);
      setDashboardError(
        'The admin dashboard is not configured. Set up Supabase before signing in.'
      );
      setIsLoading(false);
      setAuthReady(true);
      return () => {
        active = false;
      };
    }
  }, []);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDashboardError(null);
    setIsSigningIn(true);
    try {
      const { error } = await getSupabaseClient().auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error('Admin sign-in failed:', error);
      setDashboardError(
        error instanceof Error ? error.message : 'Could not sign in. Please try again.'
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setDashboardError(null);
    try {
      const { error } = await getSupabaseClient().auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Admin sign-out failed:', error);
      setDashboardError('Could not sign out. Please try again.');
    }
  };

  const updateBooking = async (
    booking: Booking,
    changes: { status?: Booking['status']; paymentStatus?: PaymentStatus; slotId?: string }
  ) => {
    if (!session) return;
    setDashboardError(null);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId: booking.id, ...changes }),
      });
      const result = (await response.json()) as AdminApiResponse;
      if (!response.ok || !result.booking) {
        throw new Error(result.error || 'Could not update this booking.');
      }

      const updatedBooking = result.booking;
      setBookings((current) =>
        current.map((item) => (item.id === updatedBooking.id ? updatedBooking : item))
      );
      if (changes.status === 'cancelled') {
        setSlots((current) =>
          current.map((slot) =>
            slot.id === booking.slot_id ? { ...slot, is_available: true } : slot
          )
        );
      }
      if (changes.slotId) {
        setSlots((current) =>
          current.map((slot) => {
            if (slot.id === booking.slot_id) return { ...slot, is_available: true };
            if (slot.id === changes.slotId) return { ...slot, is_available: false };
            return slot;
          })
        );
        setRescheduleSelections((current) => ({ ...current, [booking.id]: '' }));
      }
      setNotice(
        result.emailWarning ||
          (changes.status === 'confirmed' || changes.status === 'cancelled' || changes.slotId
            ? 'Booking updated.'
            : 'Booking details updated.')
      );
    } catch (error) {
      console.error('Admin booking update failed:', error);
      setDashboardError(
        error instanceof Error ? error.message : 'Could not update this booking.'
      );
    }
  };

  const handleAddSlot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDashboardError(null);
    setNotice(null);
    setIsSavingSlot(true);
    try {
      getSlotDuration(slotTime, slotEndTime);
      const newSlots = getSlotDates(slotDate, slotEndDate || slotDate).map((date) => ({
        slot_date: date,
        slot_time: slotTime,
        slot_end_time: slotEndTime,
      }));
      const { data, error } = await getSupabaseClient()
        .from('availability_slots')
        .insert(newSlots)
        .select('*');
      if (error) {
        throw new Error(
          error.code === '23505'
            ? 'A slot already exists at this time on one or more selected dates. No slots were added. Choose a different range or time.'
            : error.message
        );
      }
      setSlots((current) =>
        [...current, ...data].sort((a, b) =>
          `${a.slot_date}T${a.slot_time}`.localeCompare(`${b.slot_date}T${b.slot_time}`)
        )
      );
      setSlotDate('');
      setSlotEndDate('');
      setSlotTime('');
      setSlotEndTime('');
      setNotice(`${data.length} availability slot${data.length === 1 ? '' : 's'} added.`);
    } catch (error) {
      console.error('Could not add availability:', error);
      setDashboardError(
        error instanceof Error
          ? `Could not add availability: ${error.message}`
          : 'Could not add availability. Check the date and time.'
      );
    } finally {
      setIsSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (slot: AvailabilitySlot) => {
    setDashboardError(null);
    setNotice(null);
    try {
      const { data, error } = await getSupabaseClient()
        .from('availability_slots')
        .delete()
        .eq('id', slot.id)
        .eq('is_available', true)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!data) {
        throw new Error('This appointment is no longer available to remove.');
      }
      setSlots((current) => current.filter((item) => item.id !== slot.id));
      setNotice('Availability removed.');
    } catch (error) {
      console.error('Could not remove availability:', error);
      setDashboardError(
        error instanceof Error
          ? error.message
          : 'Could not remove this availability.'
      );
    }
  };

  return (
    <main className="site adminSite">
      <section className="hero reveal">
        <p className="kicker">Emerald Spotless</p>
        <h1>Booking Dashboard</h1>
        <p className="summary">
          Review booking requests, manage appointment availability, and update
          customers on their booking status.
        </p>
      </section>

      {dashboardError && (
        <p className="adminAlert" role="alert">
          {dashboardError}
        </p>
      )}
      {notice && (
        <p className="adminNotice" role="status">
          {notice}
        </p>
      )}

      {!authReady || isLoading ? (
        <p className="adminStatus" role="status">
          Loading dashboard…
        </p>
      ) : !session ? (
        <section className="panelCard adminLogin">
          <h2>Admin sign in</h2>
          <form className="checkoutForm" onSubmit={handleSignIn}>
            <div className="formField">
              <label htmlFor="adminEmail">Email</label>
              <input
                id="adminEmail"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="formField">
              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type="submit" className="submitBtn" disabled={isSigningIn}>
              {isSigningIn ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
      ) : !isAdmin ? (
        <section className="panelCard adminLogin">
          <h2>Admin access required</h2>
          <p>
            This account is not authorized to manage bookings. Ask an existing
            administrator to add it, or sign out and use an admin account.
          </p>
          <button type="button" className="adminSecondaryButton" onClick={handleSignOut}>
            Sign out
          </button>
        </section>
      ) : (
        <>
          <div className="adminToolbar">
            <p>Signed in as {session.user.email}</p>
            <button type="button" className="adminSecondaryButton" onClick={handleSignOut}>
              Sign out
            </button>
          </div>

          <section className="panelCard adminSection">
            <h2>Manage availability</h2>
            <p id="slotRangeHelp">
              Add one slot, or choose an end date to repeat the same start time every
              day through that date, including weekends. Each slot must last 1 to 8
              hours on the same day. Customers book the entire time range.
            </p>
            <form className="adminSlotForm" onSubmit={handleAddSlot}>
              <div className="formField">
                <label htmlFor="slotDate">Start date</label>
                <input
                  id="slotDate"
                  type="date"
                  min={todayDateKey()}
                  required
                  disabled={isSavingSlot}
                  value={slotDate}
                  onChange={(event) => setSlotDate(event.target.value)}
                />
              </div>
              <div className="formField">
                <label htmlFor="slotEndDate">End date (optional)</label>
                <input
                  id="slotEndDate"
                  type="date"
                  min={slotDate || todayDateKey()}
                  aria-describedby="slotRangeHelp"
                  disabled={isSavingSlot}
                  value={slotEndDate}
                  onChange={(event) => setSlotEndDate(event.target.value)}
                />
              </div>
              <div className="formField">
                <label htmlFor="slotTime">Start time</label>
                <input
                  id="slotTime"
                  type="time"
                  required
                  disabled={isSavingSlot}
                  value={slotTime}
                  onChange={(event) => setSlotTime(event.target.value)}
                />
              </div>
              <div className="formField">
                <label htmlFor="slotEndTime">End time</label>
                <input
                  id="slotEndTime"
                  type="time"
                  required
                  disabled={isSavingSlot}
                  value={slotEndTime}
                  onChange={(event) => setSlotEndTime(event.target.value)}
                />
              </div>
              <button type="submit" className="submitBtn" disabled={isSavingSlot}>
                {isSavingSlot ? 'Adding…' : 'Add availability'}
              </button>
            </form>

            {slots.length === 0 ? (
              <p className="adminStatus">No appointment slots have been added.</p>
            ) : (
              <div className="adminSlotList">
                {slots.map((slot) => (
                  <div className="adminSlotItem" key={slot.id}>
                    <span>
                      {formatBookingDate(slot.slot_date)} at {formatSlotTime(slot.slot_time, slot.slot_end_time)}
                    </span>
                    <span className={slot.is_available ? 'slotAvailable' : 'slotUnavailable'}>
                      {slot.is_available ? 'Available' : 'Reserved'}
                    </span>
                    {slot.is_available && (
                      <button
                        type="button"
                        className="adminTextButton"
                        onClick={() => void handleDeleteSlot(slot)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="adminSection">
            <h2>Booking requests ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <article className="panelCard">
                <p>No booking requests yet.</p>
              </article>
            ) : (
              <div className="adminBookingList">
                {bookings.map((booking) => {
                  const reschedulable =
                    booking.status === 'pending' || booking.status === 'confirmed';
                  const availableSlots = slots.filter(
                    (slot) => slot.is_available && slot.id !== booking.slot_id
                  );

                  return (
                    <article className="panelCard adminBooking" key={booking.id}>
                      <div className="adminBookingHeader">
                        <div>
                          <h3>{booking.customer_name}</h3>
                          <p>
                            {formatBookingDate(booking.preferred_date)} at{' '}
                            {formatSlotTime(booking.preferred_time, booking.preferred_end_time)}
                          </p>
                        </div>
                        <span className={`bookingStatus ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="adminBookingDetails">
                        <p><strong>Service:</strong> {booking.service_type}</p>
                        <p><strong>Duration:</strong> {booking.hours} hour{booking.hours === 1 ? '' : 's'}</p>
                        <p><strong>Email:</strong> <a href={`mailto:${booking.email}`}>{booking.email}</a></p>
                        <p><strong>Phone:</strong> <a href={`tel:${booking.phone}`}>{booking.phone}</a></p>
                        <p><strong>Address:</strong> {booking.address}</p>
                        {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                      </div>

                      <div className="adminBookingControls">
                        <label>
                          Payment
                          <select
                            value={booking.payment_status}
                            onChange={(event) => {
                              const paymentStatus = event.target.value;
                              if (isPaymentStatus(paymentStatus)) {
                                void updateBooking(booking, { paymentStatus });
                              }
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </label>

                        {booking.status === 'pending' && (
                          <button
                            type="button"
                            className="adminActionButton"
                            onClick={() => void updateBooking(booking, { status: 'confirmed' })}
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== 'cancelled' &&
                          booking.status !== 'completed' && (
                            <button
                              type="button"
                              className="adminCancelButton"
                              onClick={() =>
                                void updateBooking(booking, { status: 'cancelled' })
                              }
                            >
                              Cancel
                            </button>
                          )}
                        {booking.status === 'confirmed' && (
                          <button
                            type="button"
                            className="adminSecondaryButton"
                            onClick={() => void updateBooking(booking, { status: 'completed' })}
                          >
                            Mark complete
                          </button>
                        )}
                      </div>

                      {reschedulable && (
                        <div className="adminReschedule">
                          <label htmlFor={`reschedule-${booking.id}`}>Reschedule</label>
                          <select
                            id={`reschedule-${booking.id}`}
                            value={rescheduleSelections[booking.id] || ''}
                            onChange={(event) =>
                              setRescheduleSelections((current) => ({
                                ...current,
                                [booking.id]: event.target.value,
                              }))
                            }
                          >
                            <option value="">Choose an available appointment</option>
                            {availableSlots.map((slot) => (
                              <option key={slot.id} value={slot.id}>
                                {formatBookingDate(slot.slot_date)} at {formatSlotTime(slot.slot_time, slot.slot_end_time)}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="adminSecondaryButton"
                            disabled={!rescheduleSelections[booking.id]}
                            onClick={() =>
                              void updateBooking(booking, {
                                slotId: rescheduleSelections[booking.id],
                              })
                            }
                          >
                            Save new time
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
