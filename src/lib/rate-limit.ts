/**
 * Minimal in-process rate limiting for the contact endpoint.
 *
 * Deliberately dependency-free and best-effort: the state lives in the module,
 * so it resets on a cold start and is per-instance. That is the right trade for
 * a personal site — it stops the casual flood and the double-click, and there
 * is no store to run. Swap in a shared store if this ever needs to be exact.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const recentPayloads = new Map<string, number>();

/** Above this many tracked keys, expired entries are swept before inserting. */
const MAX_TRACKED_KEYS = 5_000;

function sweepBuckets(now: number): void {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

function sweepPayloads(now: number): void {
  if (recentPayloads.size < MAX_TRACKED_KEYS) return;
  for (const [key, expiresAt] of recentPayloads) {
    if (expiresAt <= now) recentPayloads.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the caller may retry; 0 when allowed. */
  retryAfter: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweepBuckets(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfter: 0 };
}

/**
 * True when an identical message was already *delivered* within the window —
 * the double-submit case, which should look like success but must not send a
 * second email.
 */
export function wasRecentlyDelivered(fingerprint: string): boolean {
  const now = Date.now();
  const expiresAt = recentPayloads.get(fingerprint);
  return Boolean(expiresAt && expiresAt > now);
}

/**
 * Records a delivery. Called only after the message actually goes out, so a
 * retry following a transient failure is still allowed through rather than
 * being silently swallowed with a fake success.
 */
export function recordDelivery(fingerprint: string, windowMs: number): void {
  const now = Date.now();
  sweepPayloads(now);
  recentPayloads.set(fingerprint, now + windowMs);
}
