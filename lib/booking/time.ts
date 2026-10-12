/**
 * Pure time helpers for the booking engine. No framework/runtime deps so this
 * module is unit-testable with `node --test`.
 *
 * All times are "HH:MM" (24h) strings representing wall-clock time in the
 * hospital's timezone. We never do Date math across timezones here; the caller
 * resolves "today in hospital tz" and passes plain date/time strings.
 */

/** "HH:MM" -> minutes since midnight. Throws on malformed input. */
export function toMinutes(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) throw new Error(`Invalid time: "${hhmm}"`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) throw new Error(`Out-of-range time: "${hhmm}"`);
  return h * 60 + min;
}

/** minutes since midnight -> "HH:MM" (zero-padded). */
export function fromMinutes(mins: number): string {
  const normalized = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutes(hhmm: string, delta: number): string {
  return fromMinutes(toMinutes(hhmm) + delta);
}

/** True if [aStart,aEnd) overlaps [bStart,bEnd). All args are "HH:MM". */
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const as = toMinutes(aStart);
  const ae = toMinutes(aEnd);
  const bs = toMinutes(bStart);
  const be = toMinutes(bEnd);
  return as < be && bs < ae;
}

/** Day-of-week string ('monday'..'sunday') for an ISO date "YYYY-MM-DD" (UTC-safe). */
export function dayOfWeek(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  // Use UTC to avoid local-tz off-by-one; the date itself already encodes the day.
  const idx = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun..6=Sat
  return ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][idx];
}
