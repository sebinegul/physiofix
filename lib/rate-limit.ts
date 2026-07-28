/**
 * Simple in-memory rate limiter for login/API endpoints.
 * Resets on server restart — good enough for a solo-dev project.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now >= entry.resetAt) store.delete(key);
  });
}, 5 * 60 * 1000);

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number; // seconds until reset
}

/**
 * Check if a request is rate-limited.
 *
 * @param key - Unique identifier (IP, email, or combination)
 * @param maxAttempts - Max requests allowed in the window (default 5)
 * @param windowSeconds - Time window in seconds (default 300 = 5 min)
 */
export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowSeconds = 300
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxAttempts - 1, resetIn: windowSeconds };
  }

  entry.count += 1;
  const allowed = entry.count <= maxAttempts;
  return {
    allowed,
    remaining: Math.max(0, maxAttempts - entry.count),
    resetIn: Math.max(0, Math.ceil((entry.resetAt - now) / 1000)),
  };
}
