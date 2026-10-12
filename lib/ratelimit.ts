import "server-only";

/**
 * Minimal in-memory fixed-window rate limiter. Best-effort only: state lives in
 * the current server instance's memory, so it does NOT coordinate across
 * multiple instances. For production-grade limits, back this with Redis/Upstash.
 * It is sufficient to blunt casual abuse of public endpoints (e.g. contact form).
 */
type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { allowed: false, remaining: 0 };
  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
