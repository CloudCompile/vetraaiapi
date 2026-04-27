"use strict";
/**
 * Vetra API Server - Health & Status Routes
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const config_1 = require("../config");
const models_1 = require("../models");
const router = (0, express_1.Router)();
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
    const openRouterConfigured = config_1.config.openRouterKeys.length > 0;
    res.json({
        status: openRouterConfigured ? 'operational' : 'degraded',
        service: 'vetra-api',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        providers: {
            openrouter: {
                configured: openRouterConfigured,
                keysAvailable: config_1.config.openRouterKeys.length,
            },
        },
        models: {
            total: models_1.CHAT_MODELS.length,
            chat: models_1.CHAT_MODELS.length,
        },
        rateLimits: {
            windowMs: config_1.config.rateLimitWindowMs,
            maxRequests: config_1.config.rateLimitMaxRequests,
        },
    });
});
exports.default = router;
//# sourceMappingURL=health.js.map