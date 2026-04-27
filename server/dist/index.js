"use strict";
/**
 * Vetra API Server
 * Standalone Express-based API for roleplayers
 * Provides OpenAI-compatible chat completions via free OpenRouter models
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const config_1 = require("./config");
const chat_1 = __importDefault(require("./routes/chat"));
const models_1 = __importDefault(require("./routes/models"));
const health_1 = __importDefault(require("./routes/health"));
const app = (0, express_1.default)();
// Validate configuration
(0, config_1.validateConfig)();
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
// CORS
const corsOrigins = config_1.config.corsOrigins.includes('*')
    ? '*'
    : config_1.config.corsOrigins;
app.use((0, cors_1.default)({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-character-id'],
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Request logging
app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
    next();
});
// API Routes
app.use('/v1/chat', chat_1.default);
app.use('/v1/models', models_1.default);
app.use('/', health_1.default);
// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        name: 'Vetra AI API',
        description: 'Free AI API for roleplayers - OpenRouter-powered',
        version: '1.0.0',
        documentation: '/docs',
        endpoints: {
            chat: 'POST /v1/chat/completions',
            models: 'GET /v1/models',
            health: 'GET /health',
            status: 'GET /status',
        },
    });
});
// Simple docs endpoint
app.get('/docs', (_req, res) => {
    res.json({
        overview: 'Vetra is a free AI API for roleplayers, powered by OpenRouter free-tier models.',
        authentication: {
            type: 'API Key (optional but recommended)',
            header: 'Authorization: Bearer YOUR_API_KEY',
            note: 'Anonymous requests are rate-limited by IP. API key requests get higher limits.',
        },
        endpoints: {
            'POST /v1/chat/completions': {
                description: 'Generate chat completions',
                body: {
                    model: 'string (required) - Model ID or alias',
                    messages: 'array (required) - Array of {role, content} objects',
                    temperature: 'number (optional) - 0-2, default 0.7',
                    max_tokens: 'number (optional) - Max tokens to generate',
                    stream: 'boolean (optional) - Enable streaming, default false',
                    top_p: 'number (optional) - 0-1, default 1',
                    seed: 'number (optional) - Random seed',
                },
                example: {
                    model: 'qwen/qwen3.6-plus:free',
                    messages: [{ role: 'user', content: 'Hello!' }],
                    temperature: 0.7,
                    stream: false,
                },
            },
            'GET /v1/models': {
                description: 'List available models',
            },
            'GET /health': {
                description: 'Health check',
            },
            'GET /status': {
                description: 'Service status and provider info',
            },
        },
        models: {
            note: 'Use /v1/models for the full list. Popular models include:',
            popular: [
                { id: 'qwen/qwen3.6-plus:free', name: 'Qwen3.6 Plus', tags: ['chat', 'free'] },
                { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', tags: ['chat', 'free'] },
                { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1', tags: ['chat', 'free', 'reasoning'] },
                { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', tags: ['chat', 'free'] },
                { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B', tags: ['chat', 'free', 'roleplay'] },
                { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 Llama 405B', tags: ['chat', 'free', 'roleplay'] },
            ],
            aliases: {
                'gpt-4o': 'openai/gpt-oss-120b:free',
                'claude': 'mistralai/mistral-small-3.1-24b-instruct:free',
                'gemini': 'google/gemini-2.0-flash-exp:free',
                'deepseek': 'deepseek/deepseek-r1-0528:free',
                'llama': 'meta-llama/llama-3.3-70b-instruct:free',
                'mistral': 'mistralai/mistral-small-3.1-24b-instruct:free',
                'qwen': 'qwen/qwen3.6-plus:free',
                'dolphin': 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
                'hermes': 'nousresearch/hermes-3-llama-3.1-405b:free',
                'default': 'qwen/qwen3.6-plus:free',
            },
        },
        rateLimits: {
            anonymous: '5 requests/minute, 1000/day (IP-based)',
            apiKey: '20 requests/minute, 1000/day (key-based)',
            system: '10000 requests/minute (system key)',
            headers: 'X-RateLimit-Remaining, X-RateLimit-Reset, X-DailyLimit-Remaining',
        },
        notes: [
            'All models are free-tier via OpenRouter.',
            'Streaming is fully supported for compatible models.',
            'Messages can be up to 10MB each, 2000 messages max.',
            'Roleplay-friendly: large context windows, no content filtering.',
        ],
    });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        error: {
            message: 'Endpoint not found. See /docs for available endpoints.',
            type: 'invalid_request_error',
            code: 'not_found',
        },
    });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: {
            message: 'Internal server error',
            type: 'server_error',
            code: 'internal_error',
        },
    });
});
// Start server
app.listen(config_1.config.port, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    Vetra AI API Server                       ║
║           Free AI API for Roleplayers v1.0.0                ║
╠══════════════════════════════════════════════════════════════╣
║  Port:     ${config_1.config.port.toString().padEnd(49)}║
║  Env:      ${config_1.config.nodeEnv.padEnd(49)}║
║  OpenRouter keys: ${String(config_1.config.openRouterKeys.length).padEnd(40)}║
╠══════════════════════════════════════════════════════════════╣
║  Endpoints:                                                  ║
║    POST /v1/chat/completions  - Chat completions             ║
║    GET  /v1/models            - List models                  ║
║    GET  /health               - Health check                 ║
║    GET  /status               - Service status               ║
║    GET  /docs                 - API documentation            ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
exports.default = app;
//# sourceMappingURL=index.js.map