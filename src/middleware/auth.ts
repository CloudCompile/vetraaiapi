import { Request, Response, NextFunction } from 'express';

const VALID_KEYS = new Set(
  (process.env.API_KEYS || 'vetra-free-key-001').split(',').map(k => k.trim())
);

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-api-key'] as string | undefined;

  if (!key) {
    res.status(401).json({ error: 'Missing x-api-key header' });
    return;
  }

  if (!VALID_KEYS.has(key)) {
    res.status(403).json({ error: 'Invalid API key' });
    return;
  }

  next();
}
