'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AvailableSlot {
  date: string;
  time: string;
  available: boolean;
}

export default function BookingPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState('Standard Cleaning');

  // Mock availability data - in production, this would come from a database
  const bookedDates = ['2026-06-25', '2026-06-26', '2026-07-03', '2026-07-10'];
  const availableSlots: AvailableSlot[] = [
    { date: '2026-06-24', time: '09:00', available: true },
    { date: '2026-06-24', time: '13:00', available: true },
    { date: '2026-06-24', time: '16:00', available: true },
    { date: '2026-06-27', time: '08:00', available: true },
    { date: '2026-06-27', time: '12:00', available: true },
    { date: '2026-06-28', time: '10:00', available: true },
    { date: '2026-06-28', time: '14:00', available: true },
    { date: '2026-07-01', time: '09:00', available: true },
    { date: '2026-07-02', time: '13:00', available: true },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (day: number) => {
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return !bookedDates.includes(dateStr) && new Date(dateStr) > new Date();
  };

  const getTimeSlotsForDate = (dateStr: string) => {
    return availableSlots.filter((slot) => slot.date === dateStr && slot.available);
  };

  const calendarDays = [];
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
    const dateStr = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    setSelectedDate(dateStr);
    setSelectedTime(null);
  };

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      alert(
        `Booking request:\nDate: ${selectedDate}\nTime: ${selectedTime}\nService: ${serviceType}\n\nProceeding to checkout...`
      );
      // In production, redirect to checkout with pre-filled data
    }
  };

  const monthName = selectedMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const selectedDateSlots = selectedDate ? getTimeSlotsForDate(selectedDate) : [];

  return (
    <main className="site">
      <section className="hero reveal">
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
          </select>
        </article>

        <div className="calendarGrid">
          <article className="panelCard calendarCard">
            <h3>Availability Calendar</h3>
            <div className="calendarControls">
              <button onClick={handlePrevMonth}>← Previous</button>
              <span className="monthName">{monthName}</span>
              <button onClick={handleNextMonth}>Next →</button>
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
                                  !isDateAvailable(day) ? 'booked' : ''
                                } ${
                                  selectedDate ===
                                  new Date(
                                    selectedMonth.getFullYear(),
                                    selectedMonth.getMonth(),
                                    day
                                  )
                                    .toISOString()
                                    .split('T')[0]
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

            <div className="calendarLegend">
              <span className="legendItem available">Available</span>
              <span className="legendItem booked">Booked</span>
            </div>
          </article>

          <article className="panelCard timesCard">
            <h3>Select Time Slot</h3>
            {selectedDate ? (
              <div className="timeSelection">
                <p className="selectedDateDisplay">
                  <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                </p>
                {selectedDateSlots.length > 0 ? (
                  <div className="timeSlots">
                    {selectedDateSlots.map((slot) => (
                      <button
                        key={`${slot.date}-${slot.time}`}
                        className={`timeSlot ${selectedTime === slot.time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        {slot.time}
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

        {selectedDate && selectedTime && (
          <article className="panelCard bookingSummary">
            <h3>Booking Summary</h3>
            <div className="summaryRow">
              <span>Service:</span>
              <strong>{serviceType}</strong>
            </div>
            <div className="summaryRow">
              <span>Date:</span>
              <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
            </div>
            <div className="summaryRow">
              <span>Time:</span>
              <strong>{selectedTime}</strong>
            </div>
            <Link href="/checkout" className="submitBtn" onClick={handleBooking}>
              Proceed to Checkout
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
          <li>Review your booking and proceed to secure payment</li>
          <li>Receive confirmation via email with all details</li>
        </ol>
      </section>
    </main>
  );
}
