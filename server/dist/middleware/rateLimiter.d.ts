/**
 * Vetra API Server - Rate Limiting Middleware
 * In-memory rate limiting (suitable for single-instance or low-scale deployments)
 */
import { Request, Response, NextFunction } from 'express';
export declare function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void;
export declare function checkDailyLimit(req: Request, maxDaily?: number): boolean;
export declare function getDailyLimitInfo(req: Request, maxDaily?: number): {
    remaining: number;
    resetAt: number;
    limit: number;
};
//# sourceMappingURL=rateLimiter.d.ts.map