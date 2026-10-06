/**
 * Minimal in-memory rate limiter, keyed by an arbitrary string (typically
 * `"<purpose>:<ip>"` so different endpoints don't share buckets — see
 * app/api/admin/auth/login/route.ts, app/api/contact/route.ts, and
 * app/api/link-insertion/route.ts).
 *
 * This is intentionally simple: it's a best-effort defense against casual
 * brute-forcing/spam, not a substitute for a distributed rate limiter.
 * Because Vercel serverless functions don't share memory across
 * instances/regions, an attacker distributing requests across many cold
 * starts could bypass this. For stronger protection in production, consider
 * Vercel's built-in Edge/WAF rate limiting, or a shared store like Upstash
 * Redis.
 */

type Attempt = { count: number; firstAttemptAt: number };

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

const attempts = new Map<string, Attempt>();

// Expired entries were previously only ever removed lazily, when the exact
// same key happened to be looked up again after its window passed — a key
// that's never revisited (e.g. a one-off IP) would sit in memory for the
// lifetime of the process. On serverless this barely matters (instances
// recycle often), but for a long-running `next start` deployment it's an
// unbounded, slow memory leak. A cheap periodic sweep bounds it instead.
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
let lastCleanupAt = Date.now();

function sweepExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanupAt < CLEANUP_INTERVAL_MS) return;
  lastCleanupAt = now;
  for (const [key, entry] of attempts) {
    if (now - entry.firstAttemptAt > WINDOW_MS) {
      attempts.delete(key);
    }
  }
}

export function isRateLimited(key: string): boolean {
  sweepExpiredEntries();
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) return false;

  if (now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

export function recordAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}
