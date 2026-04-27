"use strict";
/**
 * Vetra API Server Configuration
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigins: (process.env.CORS_ORIGINS || '*').split(',').map(s => s.trim()),
    // Rate limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20', 10),
    // Provider timeouts
    providerTimeoutMs: parseInt(process.env.PROVIDER_TIMEOUT_MS || '300000', 10),
    // API Key auth
    systemApiKey: process.env.SYSTEM_API_KEY || '',
    // OpenRouter keys
    openRouterKeys: [
        process.env.OPENROUTER_API_KEY,
        process.env.OPENROUTER_API_KEY_1,
        process.env.OPENROUTER_API_KEY_2,
        process.env.OPENROUTER_API_KEY_3,
        process.env.OPENROUTER_API_KEY_4,
        process.env.OPENROUTER_API_KEY_5,
        process.env.OPENROUTER_API_KEY_6,
        process.env.OPENROUTER_API_KEY_7,
        process.env.OPENROUTER_API_KEY_8,
        process.env.OPENROUTER_API_KEY_9,
        process.env.OPENROUTER_API_KEY_10,
    ].filter(Boolean),
    // OpenRouter base URL
    openRouterUrl: 'https://openrouter.ai/api/v1/chat/completions',
    openRouterModelsUrl: 'https://openrouter.ai/api/v1/models',
    // Max tokens safety cap
    maxTokensSafetyCap: 4096,
    defaultMaxTokens: 2048,
    // Roleplay-friendly limits
    maxMessageLength: 10000000, // 10MB per message
    maxTotalLength: 50000000, // 50MB total
    maxMessagesCount: 2000, // More history for roleplayers
};
// Validate required config
function validateConfig() {
    if (exports.config.openRouterKeys.length === 0) {
        console.warn('[Config] No OpenRouter API keys configured. The server will start but chat requests will fail.');
        console.warn('[Config] Get a free key at https://openrouter.ai/keys and set OPENROUTER_API_KEY');
    }
}
//# sourceMappingURL=config.js.map