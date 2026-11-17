export function getSlotDuration(startTime: string, endTime: string): number {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(?::00)?$/;
  const start = timePattern.exec(startTime);
  const end = timePattern.exec(endTime);
  if (!start || !end) {
    throw new Error('Choose valid start and end times.');
  }
  const minutes =
    Number(end[1]) * 60 + Number(end[2]) -
    (Number(start[1]) * 60 + Number(start[2]));
  if (minutes < 60 || minutes > 480) {
    throw new Error('The end time must be 1 to 8 hours after the start time on the same day.');
  }
  return minutes / 60;
}

export function formatSlotTime(startTime: string, endTime?: string | null): string {
  return endTime
    ? `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`
    : startTime.slice(0, 5);
}

export function getSlotDates(startDate: string, endDate: string): string[] {
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
    !Number.isFinite(start.getTime()) ||
    !Number.isFinite(end.getTime()) ||
    start.toISOString().slice(0, 10) !== startDate ||
    end.toISOString().slice(0, 10) !== endDate
  ) {
    throw new Error('Choose valid start and end dates.');
  }
  if (end < start) {
    throw new Error('The end date must be on or after the start date.');
  }

  const dates: string[] = [];
  for (const date = new Date(start); date <= end; date.setUTCDate(date.getUTCDate() + 1)) {
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
}
