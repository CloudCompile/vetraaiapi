"use strict";
/**
 * Vetra API Server - Rate Limiting Middleware
 * In-memory rate limiting (suitable for single-instance or low-scale deployments)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = rateLimitMiddleware;
exports.checkDailyLimit = checkDailyLimit;
exports.getDailyLimitInfo = getDailyLimitInfo;
const config_1 = require("../config");
// In-memory store - key can be API key or IP
const rateLimitStore = new Map();
// Cleanup old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetAt <= now) {
            rateLimitStore.delete(key);
        }
    }
}, 60000); // Clean every minute
function getClientIdentifier(req) {
    // Prefer API key from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const key = authHeader.slice(7).trim();
        if (key.length > 0) {
            return `key:${key}`;
        }
    }
    // Fallback to IP
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return `ip:${ip}`;
}
function getRateLimitForRequest(req) {
    // Check if system request
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
        const key = authHeader.slice(7).trim();
        if (config_1.config.systemApiKey && key === config_1.config.systemApiKey) {
            return { limit: 10000, windowMs: 60000 }; // Very high limit for system
        }
    }
    // Default rate limits
    return {
        limit: config_1.config.rateLimitMaxRequests,
        windowMs: config_1.config.rateLimitWindowMs,
    };
}
function rateLimitMiddleware(req, res, next) {
    const identifier = getClientIdentifier(req);
    const { limit, windowMs } = getRateLimitForRequest(req);
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);
    if (!entry || entry.resetAt <= now) {
        // New window
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt: now + windowMs,
        });
        res.setHeader('X-RateLimit-Limit', String(limit));
        res.setHeader('X-RateLimit-Remaining', String(limit - 1));
        res.setHeader('X-RateLimit-Reset', String(now + windowMs));
        next();
        return;
    }
    // Existing window
    if (entry.count >= limit) {
        res.setHeader('X-RateLimit-Limit', String(limit));
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', String(entry.resetAt));
        res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
        res.status(429).json({
            error: {
                message: `Rate limit exceeded. Limit: ${limit} requests per ${Math.ceil(windowMs / 1000)} seconds.`,
                type: 'requests',
                param: null,
                code: 'rate_limit_exceeded',
            },
        });
        return;
    }
    entry.count++;
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(entry.resetAt));
    next();
}
// Daily limit tracking (separate from per-minute rate limit)
const dailyLimitStore = new Map();
function checkDailyLimit(req, maxDaily = 1000) {
    const identifier = getClientIdentifier(req);
    const today = new Date().toISOString().split('T')[0];
    const entry = dailyLimitStore.get(identifier);
    if (!entry || entry.date !== today) {
        dailyLimitStore.set(identifier, { count: 1, date: today });
        return true;
    }
    if (entry.count >= maxDaily) {
        return false;
    }
    entry.count++;
    return true;
}
function getDailyLimitInfo(req, maxDaily = 1000) {
    const identifier = getClientIdentifier(req);
    const today = new Date().toISOString().split('T')[0];
    const nextMidnight = new Date();
    nextMidnight.setUTCHours(24, 0, 0, 0);
    const entry = dailyLimitStore.get(identifier);
    if (!entry || entry.date !== today) {
        return { remaining: maxDaily, resetAt: nextMidnight.getTime(), limit: maxDaily };
    }
    return {
        remaining: Math.max(0, maxDaily - entry.count),
        resetAt: nextMidnight.getTime(),
        limit: maxDaily,
    };
}
//# sourceMappingURL=rateLimiter.js.map