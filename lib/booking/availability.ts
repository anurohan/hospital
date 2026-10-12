/**
 * Pure availability engine. Given a doctor's schedule for a day, the slot
 * duration, break window, and the set of already-booked start times, it
 * produces the list of bookable slots. No DB/framework deps -> unit-testable.
 *
 * This is the SERVER-SIDE source of truth for availability. The booking action
 * recomputes availability on the server before every insert; a client-side
 * check alone is never trusted (and the DB has a unique index as a final guard).
 */
import { toMinutes, fromMinutes, overlaps } from "./time";

export interface DaySchedule {
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  slot_duration_minutes: number;
  break_start?: string | null;
  break_end?: string | null;
  max_patients?: number | null;
}

export interface SlotView {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface GenerateOptions {
  /** Start times ("HH:MM") already taken by active appointments. */
  bookedStartTimes?: string[];
  /** "now" as "HH:MM" when the target date is today; past slots are unavailable. */
  nowIfToday?: string | null;
  /** Minimum lead time in minutes before a slot can be booked (default 0). */
  minLeadMinutes?: number;
}

/**
 * Generate the full grid of slots for a day, flagging availability.
 * A slot is unavailable if it overlaps the break, is already booked, exceeds
 * max_patients, or is in the past (when the date is today).
 */
export function generateSlots(
  schedule: DaySchedule,
  options: GenerateOptions = {}
): SlotView[] {
  const { bookedStartTimes = [], nowIfToday = null, minLeadMinutes = 0 } = options;
  const duration = schedule.slot_duration_minutes;
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid slot_duration_minutes: ${duration}`);
  }

  const open = toMinutes(schedule.start_time);
  const close = toMinutes(schedule.end_time);
  if (close <= open) return [];

  const booked = new Set(bookedStartTimes.map((t) => t.slice(0, 5)));
  const maxPatients = schedule.max_patients ?? Infinity;
  const nowMin = nowIfToday != null ? toMinutes(nowIfToday) + minLeadMinutes : null;

  const slots: SlotView[] = [];
  const bookedCount = booked.size;

  for (let start = open; start + duration <= close; start += duration) {
    const startStr = fromMinutes(start);
    const endStr = fromMinutes(start + duration);

    let available = true;

    // Break window
    if (schedule.break_start && schedule.break_end) {
      if (overlaps(startStr, endStr, schedule.break_start, schedule.break_end)) {
        available = false;
      }
    }
    // Past slot (today only)
    if (available && nowMin != null && start < nowMin) available = false;
    // Already booked
    if (available && booked.has(startStr)) available = false;
    // Capacity reached
    if (available && bookedCount >= maxPatients) available = false;

    slots.push({ start_time: startStr, end_time: endStr, is_available: available });
  }
  return slots;
}

/** Convenience: only the bookable slots. */
export function availableSlots(
  schedule: DaySchedule,
  options: GenerateOptions = {}
): SlotView[] {
  return generateSlots(schedule, options).filter((s) => s.is_available);
}

/** Server-side guard: is a specific start time bookable for this schedule/day? */
export function isSlotBookable(
  schedule: DaySchedule,
  startTime: string,
  options: GenerateOptions = {}
): boolean {
  const target = startTime.slice(0, 5);
  return generateSlots(schedule, options).some(
    (s) => s.start_time === target && s.is_available
  );
}
