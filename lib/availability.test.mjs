import assert from 'node:assert/strict';
import test from 'node:test';
import { getSlotDates, getSlotDuration } from './availability.ts';

test('calculates the full slot duration, including partial hours and database times', () => {
  assert.equal(getSlotDuration('09:00', '12:00'), 3);
  assert.equal(getSlotDuration('09:30:00', '12:00:00'), 2.5);
  assert.equal(getSlotDuration('09:00', '17:00'), 8);
});

test('rejects invalid, reversed, overnight, and unsupported slot lengths', () => {
  for (const [start, end] of [
    ['12:00', '09:00'], ['09:00', '09:00'], ['23:00', '02:00'],
    ['09:00', '09:30'], ['09:00', '18:00'], ['24:00', '12:00'], ['09:00', ''],
  ]) {
    assert.throws(() => getSlotDuration(start, end));
  }
});

test('includes both ends of a range across a leap-year month boundary', () => {
  assert.deepEqual(getSlotDates('2028-02-28', '2028-03-01'), [
    '2028-02-28',
    '2028-02-29',
    '2028-03-01',
  ]);
});

test('keeps single-date availability working', () => {
  assert.deepEqual(getSlotDates('2026-11-18', '2026-11-18'), ['2026-11-18']);
});

test('does not skip or duplicate dates across daylight-saving changes', () => {
  assert.deepEqual(getSlotDates('2027-03-27', '2027-03-29'), [
    '2027-03-27',
    '2027-03-28',
    '2027-03-29',
  ]);
});

test('rejects reversed ranges and invalid calendar dates', () => {
  assert.throws(() => getSlotDates('2026-11-20', '2026-11-18'), /end date/);
  for (const date of ['2027-02-29', '2026-13-01', '', '2026-2-01']) {
    assert.throws(() => getSlotDates(date, '2027-03-01'), /valid start and end dates/);
    assert.throws(() => getSlotDates('2026-11-18', date), /valid start and end dates/);
  }
});
