"use strict";
/**
 * Vetra API Server - Authentication Middleware
 * Simple API key validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractApiKey = extractApiKey;
exports.apiKeyAuth = apiKeyAuth;
exports.requireApiKey = requireApiKey;
const config_1 = require("../config");
/**
 * Extract API key from Authorization header
 */
function extractApiKey(headers) {
    const authHeader = headers.authorization;
    if (!authHeader)
        return null;
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }
    if (authHeader.startsWith('Token ')) {
        return authHeader.slice(6).trim();
    }
    return null;
}
/**
 * Middleware to validate API key presence
 * Note: This is a simple middleware - actual key validation happens
 * in the route handlers where we check against stored keys.
 * For the standalone server, we accept any key format and use it
 * for rate limiting / identification.
 */
function apiKeyAuth(req, res, next) {
    const apiKey = extractApiKey(req.headers);
    // Check if system key
    if (apiKey && config_1.config.systemApiKey && apiKey === config_1.config.systemApiKey) {
        req.isSystemRequest = true;
        req.userPlan = 'admin';
        req.apiKey = apiKey;
        next();
        return;
    }
    // For the standalone server, we don't strictly require an API key
    // but we encourage it for better rate limits and tracking.
    // Anonymous requests are rate-limited by IP.
    if (apiKey) {
        req.apiKey = apiKey;
        req.userPlan = 'free';
    }
    else {
        req.userPlan = 'anonymous';
    }
    next();
}
/**
 * Middleware that REQUIRES an API key (for sensitive endpoints)
 */
function requireApiKey(req, res, next) {
    const apiKey = extractApiKey(req.headers);
    if (!apiKey) {
        res.status(401).json({
            error: {
                message: 'API key is required. Include it in the Authorization header as: Bearer YOUR_API_KEY',
                type: 'authentication_error',
                param: null,
                code: 'missing_api_key',
            },
        });
        return;
    }
    req.apiKey = apiKey;
    next();
}
//# sourceMappingURL=auth.js.map