'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseClient, type AvailabilitySlot } from '../../lib/supabase';
import { formatSlotTime } from '../../lib/availability';

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayDateKey() {
  const today = new Date();
  return toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
}

function formatDate(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BookingPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState('Standard Cleaning');
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      try {
        const { data, error } = await getSupabaseClient()
          .from('availability_slots')
          .select('*')
          .eq('is_available', true)
          .gte('slot_date', todayDateKey())
          .order('slot_date')
          .order('slot_time');

        if (error) throw error;
        if (active) setAvailableSlots(data);
      } catch (error) {
        console.error('Could not load booking availability:', error);
        if (active) {
          setAvailabilityError(
            'Online availability is temporarily unavailable. Please call us to book.'
          );
        }
      } finally {
        if (active) setIsLoadingAvailability(false);
      }
    };

    void loadAvailability();
    return () => {
      active = false;
    };
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (day: number) => {
    const dateKey = toDateKey(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      day
    );
    return availableSlots.some((slot) => slot.slot_date === dateKey);
  };

  const getTimeSlotsForDate = (dateStr: string) => {
    return availableSlots.filter((slot) => slot.slot_date === dateStr);
  };

  const calendarDays: Array<number | null> = [];
  const firstDay = getFirstDayOfMonth(selectedMonth);
  const daysInMonth = getDaysInMonth(selectedMonth);

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePrevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDateSelect = (day: number) => {
    const dateStr = toDateKey(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      day
    );
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };

  const monthName = selectedMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const selectedDateSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];
  const selectedSlot = selectedDateSlots.find(
    (slot) => slot.slot_time.slice(0, 5) === selectedTime
  );

  return (
    <main className="site">
      <section className="hero bookingHero reveal">
        <p className="kicker">Schedule Your Cleaning</p>
        <h1>Book Your Appointment</h1>
        <p className="summary">
          Check our availability calendar and select your preferred date and time.
          Our team will confirm your booking and you can pay securely online.
        </p>
      </section>

      <section className="bookingWrap reveal">
        <article className="panelCard">
          <h3>Select Service</h3>
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
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
        </article>

        <div className="calendarGrid">
          <article className="panelCard calendarCard">
            <h3>Availability Calendar</h3>
            <div className="calendarControls">
              <button
                type="button"
                aria-label="Previous month"
                onClick={handlePrevMonth}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span>Previous</span>
              </button>
              <span className="monthName">{monthName}</span>
              <button
                type="button"
                aria-label="Next month"
                onClick={handleNextMonth}
              >
                <span>Next</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            <table className="calendarTable">
              <thead>
                <tr>
                  <th>Sun</th>
                  <th>Mon</th>
                  <th>Tue</th>
                  <th>Wed</th>
                  <th>Thu</th>
                  <th>Fri</th>
                  <th>Sat</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map(
                  (_, weekIndex) => (
                    <tr key={weekIndex}>
                      {calendarDays
                        .slice(weekIndex * 7, (weekIndex + 1) * 7)
                        .map((day, dayIndex) => (
                          <td key={dayIndex}>
                            {day !== null ? (
                              <button
                                className={`calendarDay ${
                                  !isDateAvailable(day) ? 'unavailable' : ''
                                } ${
                                  selectedDate ===
                                  toDateKey(
                                    selectedMonth.getFullYear(),
                                    selectedMonth.getMonth(),
                                    day
                                  )
                                    ? 'selected'
                                    : ''
                                }`}
                                disabled={!isDateAvailable(day)}
                                onClick={() => handleDateSelect(day)}
                              >
                                {day}
                              </button>
                            ) : null}
                          </td>
                        ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {isLoadingAvailability ? (
              <p className="availabilityMessage" role="status">
                Loading available appointments…
              </p>
            ) : availabilityError ? (
              <p className="availabilityMessage errorMessage" role="alert">
                {availabilityError}
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="availabilityMessage" role="status">
                No appointments are currently available. Please call us to arrange a booking.
              </p>
            ) : null}

            <div className="calendarLegend">
              <span className="legendItem available">Available</span>
              <span className="legendItem unavailable">Unavailable</span>
            </div>
          </article>

          <article className="panelCard timesCard">
            <h3>Select Time Slot</h3>
            {selectedDate ? (
              <div className="timeSelection">
                <p className="selectedDateDisplay">
                  <strong>Date:</strong> {formatDate(selectedDate)}
                </p>
                {selectedDateSlots.length > 0 ? (
                  <div className="timeSlots">
                    {selectedDateSlots.map((slot) => (
                      <button
                        key={slot.id}
                        className={`timeSlot ${selectedTime === slot.slot_time.slice(0, 5) ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot.slot_time.slice(0, 5))}
                      >
                        {formatSlotTime(slot.slot_time, slot.slot_end_time)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="noSlots">
                    No available slots for this date. Please select another date.
                  </p>
                )}
              </div>
            ) : (
              <p className="noSelection">Select a date to see available times</p>
            )}
          </article>
        </div>

        {selectedDate && selectedTime && selectedSlot && (
          <article className="panelCard bookingSummary">
            <h3>Booking Summary</h3>
            <div className="summaryRow">
              <span>Service:</span>
              <strong>{serviceType}</strong>
            </div>
            <div className="summaryRow">
              <span>Date:</span>
              <strong>{formatDate(selectedDate)}</strong>
            </div>
            <div className="summaryRow">
              <span>Time:</span>
              <strong>{formatSlotTime(selectedSlot.slot_time, selectedSlot.slot_end_time)}</strong>
            </div>
            <Link
              href={{
                pathname: '/checkout',
                query: {
                  slotId: selectedSlot.id,
                  serviceType,
                  date: selectedDate,
                  time: selectedTime,
                },
              }}
              className="submitBtn"
            >
              Continue to Booking Details
            </Link>
          </article>
        )}
      </section>

      <section className="infoSection reveal">
        <h3>How Our Booking System Works</h3>
        <ol className="cleanList">
          <li>Select your preferred service type</li>
          <li>Choose an available date from the calendar</li>
          <li>Pick your preferred time slot</li>
          <li>Enter your contact details and send the booking request</li>
          <li>Receive an email after our team reviews your request</li>
        </ol>
      </section>
    </main>
  );
}
