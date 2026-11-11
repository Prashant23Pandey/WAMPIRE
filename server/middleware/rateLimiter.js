import AppError from '../utils/appError.js';

// In-memory request trackers
const ipTrackers = new Map();
const emailTrackers = new Map();

// Periodic cleanup every 10 minutes (unrefed so it doesn't hold open process event loop)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipTrackers.entries()) {
    if (now > record.resetTime) {
      ipTrackers.delete(key);
    }
  }
  for (const [key, record] of emailTrackers.entries()) {
    if (now > record.resetTime) {
      emailTrackers.delete(key);
    }
  }
}, 10 * 60 * 1000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

/**
 * Creates a rate limiting middleware based on IP or custom key.
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  maxRequests = 20,
  message = 'Too many requests. Please try again later.',
  keyGenerator = (req) => req.ip || req.connection.remoteAddress || 'unknown-ip',
}) => {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let tracker = ipTrackers.get(key);

    if (!tracker || now > tracker.resetTime) {
      tracker = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipTrackers.set(key, tracker);
    } else {
      tracker.count += 1;
    }

    const remaining = Math.max(0, maxRequests - tracker.count);
    const retryAfterSeconds = Math.ceil((tracker.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(tracker.resetTime / 1000));

    if (tracker.count > maxRequests) {
      res.setHeader('Retry-After', retryAfterSeconds);
      return next(new AppError(`${message} Please wait ${retryAfterSeconds} seconds.`, 429));
    }

    next();
  };
};

// General Auth Rate Limiter: Max 20 attempts per 15 minutes
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: 'Too many authentication attempts from this IP address.',
});

// OTP Verification Limiter: Max 8 verification attempts per 10 minutes
export const otpVerifyLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  maxRequests: 8,
  message: 'Too many OTP verification attempts.',
});

// Resend OTP Cooldown & Throttle
export const resendCooldownLimiter = (req, res, next) => {
  const email = (req.body.email || '').toLowerCase().trim();
  if (!email) {
    return next(new AppError('Please provide an email address.', 400));
  }

  const now = Date.now();
  const tracker = emailTrackers.get(email);

  if (tracker) {
    // 1. Enforce 60-second cooldown between consecutive resend requests
    const cooldownMs = 60 * 1000;
    const timeSinceLast = now - tracker.lastRequest;
    if (timeSinceLast < cooldownMs) {
      const waitSeconds = Math.ceil((cooldownMs - timeSinceLast) / 1000);
      return next(
        new AppError(`Please wait ${waitSeconds} seconds before requesting another verification code.`, 429)
      );
    }

    // 2. Enforce maximum 5 resends per 1 hour window
    if (now < tracker.resetTime) {
      if (tracker.count >= 5) {
        const waitMinutes = Math.ceil((tracker.resetTime - now) / 60000);
        return next(
          new AppError(
            `Maximum OTP resend attempts reached for this email. Please try again after ${waitMinutes} minutes.`,
            429
          )
        );
      }
      tracker.count += 1;
      tracker.lastRequest = now;
    } else {
      tracker.count = 1;
      tracker.lastRequest = now;
      tracker.resetTime = now + 60 * 60 * 1000;
    }
  } else {
    emailTrackers.set(email, {
      count: 1,
      lastRequest: now,
      resetTime: now + 60 * 60 * 1000,
    });
  }

  next();
};

export default {
  authLimiter,
  otpVerifyLimiter,
  resendCooldownLimiter,
};

