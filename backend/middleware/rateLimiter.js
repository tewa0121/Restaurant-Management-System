const AppError = require('../utils/AppError');

function createRateLimiter({ windowMs = 15 * 60 * 1000, max = 15, message = 'Too many attempts. Please try again later.', keyFn } = {}) {
  const hits = new Map();

  const timer = setInterval(() => {
    const now = Date.now();
    hits.forEach((entry, key) => {
      if (entry.resetAt <= now) hits.delete(key);
    });
  }, windowMs);
  if (timer.unref) timer.unref();

  return (req, res, next) => {
    const key = keyFn ? keyFn(req) : req.ip;
    const now = Date.now();
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return next(new AppError(message, 429, 'RATE_LIMITED'));
    }
    return next();
  };
}

module.exports = { createRateLimiter };