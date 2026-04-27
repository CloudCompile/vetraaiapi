/**
 * Vetra API Server - Authentication Middleware
 * Simple API key validation
 */
import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    apiKey?: string;
    isSystemRequest?: boolean;
    userPlan?: string;
}
/**
 * Extract API key from Authorization header
 */
export declare function extractApiKey(headers: any): string | null;
/**
 * Middleware to validate API key presence
 * Note: This is a simple middleware - actual key validation happens
 * in the route handlers where we check against stored keys.
 * For the standalone server, we accept any key format and use it
 * for rate limiting / identification.
 */
export declare function apiKeyAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
/**
 * Middleware that REQUIRES an API key (for sensitive endpoints)
 */
export declare function requireApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map