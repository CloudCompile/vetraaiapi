/**
 * Vetra API Server - Health & Status Routes
 */

import { Router } from 'express';
import { config } from '../config';
import { CHAT_MODELS } from '../models';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'vetra-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'vetra-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

router.get('/status', (_req, res) => {
  const openRouterConfigured = config.openRouterKeys.length > 0;

  res.json({
    status: openRouterConfigured ? 'operational' : 'degraded',
    service: 'vetra-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    providers: {
      openrouter: {
        configured: openRouterConfigured,
        keysAvailable: config.openRouterKeys.length,
      },
    },
    models: {
      total: CHAT_MODELS.length,
      chat: CHAT_MODELS.length,
    },
    rateLimits: {
      windowMs: config.rateLimitWindowMs,
      maxRequests: config.rateLimitMaxRequests,
    },
  });
});

export default router;
