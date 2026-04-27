/**
 * Vetra API Server - Authentication Middleware
 * Simple API key validation
 */

import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
  isSystemRequest?: boolean;
  userPlan?: string;
}

/**
 * Extract API key from Authorization header
 */
export function extractApiKey(headers: any): string | null {
  const authHeader = headers.authorization;
  if (!authHeader) return null;
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
export function apiKeyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const apiKey = extractApiKey(req.headers);

  // Check if system key
  if (apiKey && config.systemApiKey && apiKey === config.systemApiKey) {
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
  } else {
    req.userPlan = 'anonymous';
  }

  next();
}

/**
 * Middleware that REQUIRES an API key (for sensitive endpoints)
 */
export function requireApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
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
