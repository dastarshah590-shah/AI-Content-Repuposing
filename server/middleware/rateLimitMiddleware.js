const buckets = new Map();

export function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 60 } = {}) {
  return function rateLimit(req, res, next) {
    const key = req.ip || req.headers["x-forwarded-for"] || "guest";
    const now = Date.now();
    const current = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > current.resetAt) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    buckets.set(key, current);

    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, max - current.count)));

    if (current.count > max) {
      return res.status(429).json({
        success: false,
        message: "You have reached the demo rate limit. Please try again later."
      });
    }

    next();
  };
}
