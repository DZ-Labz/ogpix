/**
 * Simple in-memory rate limiter.
 * Free tier: 10 requests/day per IP.
 * Pro tier: unlimited with a valid API key.
 *
 * NOTE: This is a single-process in-memory store. For multi-instance deployments,
 * replace with a Redis-backed implementation.
 */

const FREE_LIMIT = 10

interface BucketEntry {
  count: number
  resetAt: number // unix ms — midnight of the current day
}

const buckets = new Map<string, BucketEntry>()

function todayMidnightMs(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 1) // next midnight = reset point
  return d.getTime()
}

export type RateLimitResult =
  | { allowed: true; remaining: number; tier: 'free' | 'pro' }
  | { allowed: false; retryAfterMs: number; tier: 'free' }

const PRO_API_KEYS = new Set(
  (process.env.PRO_API_KEYS ?? '').split(',').filter(Boolean)
)

export function checkRateLimit(ip: string, apiKey: string | null): RateLimitResult {
  // Pro key bypasses rate limit
  if (apiKey && PRO_API_KEYS.has(apiKey)) {
    return { allowed: true, remaining: Infinity, tier: 'pro' }
  }

  const now = Date.now()
  let entry = buckets.get(ip)

  // Expired or missing — reset
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: todayMidnightMs() }
    buckets.set(ip, entry)
  }

  if (entry.count >= FREE_LIMIT) {
    return { allowed: false, retryAfterMs: entry.resetAt - now, tier: 'free' }
  }

  entry.count++
  return { allowed: true, remaining: FREE_LIMIT - entry.count, tier: 'free' }
}

// Cleanup stale entries every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    buckets.forEach((entry, key) => {
      if (entry.resetAt <= now) buckets.delete(key)
    })
  }, 60 * 60 * 1000)
}
