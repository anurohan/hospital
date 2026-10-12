/**
 * Pure ID / token formatting helpers that MIRROR the database trigger logic in
 * migrations 001/002. The database remains the authoritative generator (its
 * triggers run inside the booking transaction with advisory locks); these
 * helpers are for client previews, display, and offline unit testing.
 */

/** "ARO-20260109-0007" style appointment UID. */
export function formatAppointmentUid(
  shortName: string,
  isoDate: string,
  sequence: number
): string {
  const prefix = normalizePrefix(shortName);
  const datePart = isoDate.replace(/-/g, "");
  return `${prefix}-${datePart}-${String(sequence).padStart(4, "0")}`;
}

/** "ARO-2026-00042" style patient UID. */
export function formatPatientUid(
  shortName: string,
  year: number,
  sequence: number
): string {
  const prefix = normalizePrefix(shortName);
  return `${prefix}-${year}-${String(sequence).padStart(5, "0")}`;
}

/** "A-007" (online) / "W-007" (walk-in) token. */
export function formatToken(source: "online" | "walk_in", sequence: number): string {
  const prefix = source === "walk_in" ? "W" : "A";
  return `${prefix}-${String(sequence).padStart(3, "0")}`;
}

/** First 3 letters, uppercased, non-alpha stripped; falls back to "HSP". */
export function normalizePrefix(shortName: string): string {
  const cleaned = (shortName || "").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 3);
  return cleaned || "HSP";
}
