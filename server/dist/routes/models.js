"use strict";
/**
 * Vetra API Server - Models Route
 * OpenAI-compatible /v1/models endpoint
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };
}
router.options('/', (_req, res) => {
    res.set(getCorsHeaders());
    res.status(204).send();
});
router.get('/', (_req, res) => {
    const models = models_1.CHAT_MODELS.map(m => ({
        id: m.id,
        object: 'model',
        created: 1677610602,
        owned_by: m.provider,
    }));
    res.set(getCorsHeaders());
    res.json({
        object: 'list',
        data: models,
    });
});
exports.default = router;
//# sourceMappingURL=models.js.map