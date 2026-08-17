// Shared appointment slot definitions + parsing helpers.
// Single source of truth for bookable slots (clinic hours: Mon-Sat 9:00 AM - 7:00 PM,
// with a 12:00-2:00 PM lunch break; Sundays closed).

export const WORKING_HOURS = { start: 9 * 60, end: 19 * 60 }; // 9:00 AM - 7:00 PM (minutes from midnight)
export const SLOT_INTERVAL_MIN = 30;
export const CLOSED_DAY = 0; // JS getDay(): 0 = Sunday

// Bookable slots — every 30 minutes within working hours, minus the lunch break.
export const TIME_SLOTS_MORNING = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];

export const TIME_SLOTS_AFTERNOON = [
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
];

export const TIME_SLOTS = [...TIME_SLOTS_MORNING, ...TIME_SLOTS_AFTERNOON];

/** "3:00 PM" -> 900 (minutes from midnight, 24h). Returns -1 for invalid input. */
export function slotToMinutes(slot: string): number {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
  if (!match) return -1;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const meridian = match[3].toUpperCase();
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return -1;
  if (meridian === "PM" && hour !== 12) hour += 12;
  if (meridian === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
}

/** 900 -> "3:00 PM" */
export function minutesToSlot(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const meridian = h24 >= 12 ? "PM" : "AM";
  let hour = h24 % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${String(m).padStart(2, "0")} ${meridian}`;
}

/** Is this slot within working hours and on the bookable list? */
export function isBookableSlot(slot: string): boolean {
  return TIME_SLOTS.includes(slot);
}

/** "2026-08-14" -> UTC midnight Date (matches how type="date" values are stored). */
export function dateKeyToDate(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

/** Date -> "2026-08-14" (UTC). */
export function dateToDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's date key in India (Asia/Kolkata, UTC+5:30) — the clinic's timezone. */
export function todayDateKeyInIST(now: Date = new Date()): string {
  return new Date(now.getTime() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Current time-of-day in minutes (IST) at this instant. */
export function nowMinutesIST(now: Date = new Date()): number {
  const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
}

/** Round a minute-of-day UP to the next 30-minute slot boundary (e.g. 637 -> 660). */
export function roundUpToSlot(minutes: number): number {
  const boundary = SLOT_INTERVAL_MIN;
  return Math.ceil(minutes / boundary) * boundary;
}

/** Human day label for a dateKey relative to today (IST). */
export function dayLabel(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) return "Today";
  const tomorrow = new Date(`${todayKey}T00:00:00.000Z`);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  if (dateKey === tomorrow.toISOString().slice(0, 10)) return "Tomorrow";
  const d = new Date(`${dateKey}T00:00:00.000Z`);
  return d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }); // e.g. "Monday"
}
