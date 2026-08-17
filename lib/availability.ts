// Server-side availability logic: computes bookable slots from the shared slot list,
// existing appointments, and doctor roster blocks. Used by /api/slots/* and the
// appointment booking guard.

import { prisma } from "./prisma";
import {
  TIME_SLOTS,
  slotToMinutes,
  minutesToSlot,
  dateKeyToDate,
  dateToDateKey,
  todayDateKeyInIST,
  nowMinutesIST,
  roundUpToSlot,
  dayLabel,
  CLOSED_DAY,
  WORKING_HOURS,
} from "./slots";

export interface BlockedRange {
  start: number; // minutes from midnight, inclusive
  end: number; // minutes from midnight, exclusive
  reason?: string;
}

/** Set of minutes (from midnight) already booked for a given dateKey. */
export async function getBookedMinutes(
  dateKey: string
): Promise<Set<number>> {
  const start = dateKeyToDate(dateKey);
  const end = new Date(start.getTime() + 24 * 3600 * 1000);
  const appointments = await prisma.appointment.findMany({
    where: {
      date: { gte: start, lt: end },
      status: { in: ["pending", "confirmed"] },
    },
    select: { time: true },
  });
  const minutes = new Set<number>();
  for (const a of appointments) {
    const m = slotToMinutes(a.time);
    if (m >= 0) minutes.add(m);
  }
  return minutes;
}

/** Doctor roster blocks (in minutes-from-midnight ranges) for a given dateKey. */
export async function getBlockedRanges(dateKey: string): Promise<BlockedRange[]> {
  const start = dateKeyToDate(dateKey);
  const end = new Date(start.getTime() + 24 * 3600 * 1000);
  const blocks = await prisma.rosterBlock.findMany({
    where: { date: { gte: start, lt: end } },
    select: { startTime: true, endTime: true, reason: true },
  });
  return blocks
    .map((b) => ({
      start: parseHHMM(b.startTime),
      end: parseHHMM(b.endTime),
      reason: b.reason ?? undefined,
    }))
    .filter((r) => r.start >= 0 && r.end > r.start);
}

function parseHHMM(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return -1;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return -1;
  return h * 60 + m;
}

function isBlocked(minutes: number, ranges: BlockedRange[]): boolean {
  return ranges.some((r) => minutes >= r.start && minutes < r.end);
}

/** Bookable slots for one date, minus booked + roster-blocked. */
export async function availableSlotsForDate(
  dateKey: string
): Promise<{ available: string[]; booked: string[]; blocked: string[] }> {
  const booked = await getBookedMinutes(dateKey);
  const ranges = await getBlockedRanges(dateKey);
  const available: string[] = [];
  const bookedSlots: string[] = [];
  const blockedSlots: string[] = [];
  for (const slot of TIME_SLOTS) {
    const m = slotToMinutes(slot);
    if (m < 0) continue;
    if (booked.has(m)) bookedSlots.push(slot);
    else if (isBlocked(m, ranges)) blockedSlots.push(slot);
    else available.push(slot);
  }
  return { available, booked: bookedSlots, blocked: blockedSlots };
}

export interface NextSlot {
  dateKey: string;
  time: string; // e.g. "3:30 PM"
  minutes: number;
  label: string; // e.g. "Today · 3:30 PM"
}

/**
 * Next bookable slot: now + 30 minutes, rounded up to the next 30-min boundary,
 * within working hours (Mon-Sat), skipping booked slots and roster blocks.
 * If none remain today, rolls to the next working day's 9:00 AM slot.
 */
export async function nextAvailableSlot(
  now: Date = new Date()
): Promise<NextSlot | null> {
  const todayKey = todayDateKeyInIST(now);
  const nowMin = nowMinutesIST(now);
  const earliest = roundUpToSlot(nowMin + 30);

  // Pull all appointments + roster blocks for the next 7 days in one query each.
  const windowStart = dateKeyToDate(todayKey);
  const windowEnd = new Date(windowStart.getTime() + 8 * 24 * 3600 * 1000);
  const [appointments, blocks] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        date: { gte: windowStart, lt: windowEnd },
        status: { in: ["pending", "confirmed"] },
      },
      select: { date: true, time: true },
    }),
    prisma.rosterBlock.findMany({
      where: { date: { gte: windowStart, lt: windowEnd } },
      select: { date: true, startTime: true, endTime: true, reason: true },
    }),
  ]);

  const bookedByDay = new Map<string, Set<number>>();
  for (const a of appointments) {
    const key = dateToDateKey(a.date);
    const m = slotToMinutes(a.time);
    if (m < 0) continue;
    if (!bookedByDay.has(key)) bookedByDay.set(key, new Set());
    bookedByDay.get(key)!.add(m);
  }

  const rangesByDay = new Map<string, BlockedRange[]>();
  for (const b of blocks) {
    const key = dateToDateKey(b.date);
    const s = parseHHMM(b.startTime);
    const e = parseHHMM(b.endTime);
    if (s < 0 || e <= s) continue;
    if (!rangesByDay.has(key)) rangesByDay.set(key, []);
    rangesByDay.get(key)!.push({ start: s, end: e, reason: b.reason ?? undefined });
  }

  const base = new Date(`${todayKey}T00:00:00.000Z`);
  for (let offset = 0; offset < 7; offset++) {
    const d = new Date(base.getTime() + offset * 24 * 3600 * 1000);
    const key = d.toISOString().slice(0, 10);
    if (d.getUTCDay() === CLOSED_DAY) continue; // Sunday closed
    const booked = bookedByDay.get(key) ?? new Set<number>();
    const ranges = rangesByDay.get(key) ?? [];
    for (const slot of TIME_SLOTS) {
      const m = slotToMinutes(slot);
      if (m < 0) continue;
      if (offset === 0 && m < earliest) continue; // need 30 min lead time today
      if (booked.has(m) || isBlocked(m, ranges)) continue;
      return { dateKey: key, time: slot, minutes: m, label: `${dayLabel(key, todayKey)} · ${slot}` };
    }
  }
  return null;
}

/** True when the clinic is open right now (Mon-Sat within working hours). */
export function isOpenNow(now: Date = new Date()): boolean {
  const ist = new Date(now.getTime() + 5.5 * 3600 * 1000);
  const day = ist.getUTCDay();
  if (day === CLOSED_DAY) return false;
  const minutes = ist.getUTCHours() * 60 + ist.getUTCMinutes();
  return minutes >= WORKING_HOURS.start && minutes < WORKING_HOURS.end;
}

/** Server-side guard: is this (dateKey, slot) blocked by the doctor's roster? */
export async function isSlotRosterBlocked(
  dateKey: string,
  slot: string
): Promise<boolean> {
  const m = slotToMinutes(slot);
  if (m < 0) return false;
  const ranges = await getBlockedRanges(dateKey);
  return isBlocked(m, ranges);
}
