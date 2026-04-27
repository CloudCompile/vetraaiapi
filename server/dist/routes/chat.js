"use strict";
/**
 * Vetra API Server - Chat Completions Route
 * OpenAI-compatible /v1/chat/completions endpoint
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openrouter_1 = require("../providers/openrouter");
const models_1 = require("../models");
const rateLimiter_1 = require("../middleware/rateLimiter");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
function generateRequestId() {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-id, x-character-id',
        'Access-Control-Max-Age': '86400',
    };
}
// OPTIONS for CORS
router.options('/completions', (_req, res) => {
    res.set(getCorsHeaders());
    res.status(204).send();
});
// GET info
router.get('/completions', (_req, res) => {
    res.set(getCorsHeaders());
    res.json({
        message: 'Chat completions endpoint is active. Use POST to send messages.',
        endpoint: '/v1/chat/completions',
        example: {
            model: 'qwen/qwen3.6-plus:free',
            messages: [{ role: 'user', content: 'Hello!' }],
        },
    });
});
// POST chat completion
router.post('/completions', auth_1.apiKeyAuth, rateLimiter_1.rateLimitMiddleware, validation_1.validateChatCompletion, validation_1.validateMessages, async (req, res) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const body = req.body;
    console.log(`[${requestId}] POST /v1/chat/completions - model: ${body.model}`);
    // Check daily limit
    const dailyLimit = req.isSystemRequest ? 100000 : 1000;
    if (!req.isSystemRequest && !(0, rateLimiter_1.checkDailyLimit)(req, dailyLimit)) {
        const dailyInfo = (0, rateLimiter_1.getDailyLimitInfo)(req, dailyLimit);
        res.set({
            ...getCorsHeaders(),
            'X-DailyLimit-Remaining': '0',
            'X-DailyLimit-Reset': String(dailyInfo.resetAt),
        });
        res.status(429).json({
            error: {
                message: `Daily request limit exceeded (${dailyLimit} RPD). Resets at ${new Date(dailyInfo.resetAt).toUTCString()}.`,
                type: 'requests',
                param: null,
                code: 'daily_limit_exceeded',
            },
        });
        return;
    }
    // Validate model
    const resolvedModelId = (0, models_1.resolveModelId)(body.model);
    if (!(0, models_1.modelExists)(body.model)) {
        const popularModels = models_1.CHAT_MODELS.slice(0, 10).map(m => m.id).join(', ');
        res.set(getCorsHeaders());
        res.status(400).json({
            error: {
                message: `Unknown model: ${body.model}. Popular models: ${popularModels}, and more. Use /v1/models to see the full list.`,
                type: 'invalid_request_error',
                param: 'model',
                code: 'model_not_found',
                request_id: requestId,
            },
        });
        return;
    }
    // Call provider
    const providerResult = await (0, openrouter_1.createChatCompletion)(body, requestId);
    if (providerResult.error) {
        res.set({
            ...getCorsHeaders(),
            ...(providerResult.status === 429 && { 'Retry-After': '30' }),
            ...(providerResult.status === 503 && { 'Retry-After': '10' }),
        });
        res.status(providerResult.status).json({
            error: {
                ...providerResult.error,
                request_id: requestId,
            },
        });
        return;
    }
    // Handle streaming response
    if (body.stream && providerResult.stream) {
        const dailyInfo = (0, rateLimiter_1.getDailyLimitInfo)(req, dailyLimit);
        const rateLimitRemaining = res.getHeader('X-RateLimit-Remaining') || '?';
        const rateLimitReset = res.getHeader('X-RateLimit-Reset') || '?';
        res.set({
            ...getCorsHeaders(),
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Request-Id': requestId,
            'X-Accel-Buffering': 'no',
            'X-RateLimit-Remaining': String(rateLimitRemaining),
            'X-RateLimit-Reset': String(rateLimitReset),
            'X-DailyLimit-Remaining': String(dailyInfo.remaining),
            'X-DailyLimit-Reset': String(dailyInfo.resetAt),
            'X-Vetra-Latency': `${Date.now() - startTime}ms`,
        });
        // Read from provider stream and transform
        const reader = providerResult.stream.getReader();
        let leftover = '';
        let firstTokenReceived = false;
        const streamStartTime = Date.now();
        // Heartbeat to keep connection alive
        const heartbeat = setInterval(() => {
            res.write(': ping\n\n');
        }, 15000);
        // First token timeout (60s)
        const firstTokenTimeout = setTimeout(() => {
            if (!firstTokenReceived) {
                console.error(`[${requestId}] STREAM FIRST TOKEN TIMEOUT`);
                const timeoutError = {
                    error: {
                        message: 'The model is taking too long to start responding. This usually happens when the provider is overloaded. Try again in a moment.',
                        type: 'timeout_error',
                        code: 'first_token_timeout',
                    },
                };
                res.write(`data: ${JSON.stringify(timeoutError)}\n\n`);
                res.write('data: [DONE]\n\n');
                clearInterval(heartbeat);
                try {
                    reader.cancel('first token timeout');
                }
                catch (e) { }
                res.end();
            }
        }, 60000);
        // Stream stall timeout (5 minutes)
        let lastTokenTime = Date.now();
        const maxStallMs = 300000;
        const stallCheck = setInterval(() => {
            const idleMs = Date.now() - lastTokenTime;
            if (idleMs >= maxStallMs) {
                console.error(`[${requestId}] Stream stalled for ${idleMs}ms — closing.`);
                const stallError = {
                    error: {
                        message: 'The model stopped responding. The response may be incomplete.',
                        type: 'timeout_error',
                        code: 'stream_stall',
                    },
                };
                res.write(`data: ${JSON.stringify(stallError)}\n\n`);
                res.write('data: [DONE]\n\n');
                clearInterval(heartbeat);
                clearTimeout(firstTokenTimeout);
                clearInterval(stallCheck);
                try {
                    reader.cancel('stream stall');
                }
                catch (e) { }
                res.end();
            }
        }, 15000);
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                if (!firstTokenReceived && value.length > 0) {
                    firstTokenReceived = true;
                    clearTimeout(firstTokenTimeout);
                    console.log(`[${requestId}] First stream chunk after ${Date.now() - streamStartTime}ms`);
                }
                if (value.length > 0) {
                    lastTokenTime = Date.now();
                }
                // Decode and process chunks
                const text = new TextDecoder().decode(value, { stream: true });
                const lines = (leftover + text).split('\n');
                leftover = lines.pop() || '';
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed)
                        continue;
                    if (trimmed.startsWith('data: ')) {
                        const dataStr = trimmed.slice(6).trim();
                        if (dataStr === '[DONE]') {
                            res.write('data: [DONE]\n\n');
                            continue;
                        }
                        try {
                            const parsed = JSON.parse(dataStr);
                            // Normalize content_blocks if present
                            if (parsed.choices && parsed.choices[0]?.message?.content_blocks) {
                                const blocks = parsed.choices[0].message.content_blocks;
                                let textContent = '';
                                for (const block of blocks) {
                                    if (block.type === 'text' && block.text)
                                        textContent += block.text;
                                    else if (block.delta?.text)
                                        textContent += block.delta.text;
                                    else if (block.type === 'thinking' && block.thinking) {
                                        textContent += `\n[Thinking]: ${block.thinking}\n`;
                                    }
                                }
                                if (textContent && !parsed.choices[0].delta?.content) {
                                    if (!parsed.choices[0].delta)
                                        parsed.choices[0].delta = {};
                                    parsed.choices[0].delta.content = textContent;
                                }
                            }
                            // Ensure we have content to send
                            const choice = parsed.choices?.[0];
                            const content = choice?.delta?.content || choice?.message?.content;
                            if (!parsed.choices || parsed.choices.length === 0 || (content !== undefined && content === '')) {
                                continue;
                            }
                            res.write(`data: ${JSON.stringify(parsed)}\n\n`);
                        }
                        catch (e) {
                            res.write(`${trimmed}\n\n`);
                        }
                    }
                    else {
                        res.write(`${trimmed}\n`);
                    }
                }
            }
            // Process leftover
            if (leftover.trim()) {
                if (leftover.trim().startsWith('data: ')) {
                    const dataStr = leftover.trim().slice(6).trim();
                    if (dataStr !== '[DONE]') {
                        try {
                            const parsed = JSON.parse(dataStr);
                            res.write(`data: ${JSON.stringify(parsed)}\n\n`);
                        }
                        catch (e) {
                            res.write(`data: ${dataStr}\n\n`);
                        }
                    }
                }
            }
            // Ensure [DONE] is sent
            res.write('data: [DONE]\n\n');
        }
        catch (err) {
            console.error(`[${requestId}] Stream error:`, err);
            const errorMsg = err instanceof Error ? err.message : String(err);
            res.write(`data: ${JSON.stringify({ error: { message: `Stream error: ${errorMsg}` } })}\n\n`);
        }
        finally {
            clearInterval(heartbeat);
            clearTimeout(firstTokenTimeout);
            clearInterval(stallCheck);
            try {
                reader.cancel();
            }
            catch (e) { }
            res.end();
        }
        return;
    }
    // Non-streaming response
    const dailyInfo = (0, rateLimiter_1.getDailyLimitInfo)(req, dailyLimit);
    const rateLimitRemaining = res.getHeader('X-RateLimit-Remaining') || '?';
    const rateLimitReset = res.getHeader('X-RateLimit-Reset') || '?';
    res.set({
        ...getCorsHeaders(),
        'X-RateLimit-Remaining': String(rateLimitRemaining),
        'X-RateLimit-Reset': String(rateLimitReset),
        'X-DailyLimit-Remaining': String(dailyInfo.remaining),
        'X-DailyLimit-Reset': String(dailyInfo.resetAt),
        'X-Request-Id': requestId,
        'X-Vetra-Latency': `${Date.now() - startTime}ms`,
    });
    if (providerResult.data) {
        res.json(providerResult.data);
    }
    else {
        res.status(502).json({
            error: {
                message: 'Empty response from provider',
                type: 'api_error',
                code: 'empty_response',
                request_id: requestId,
            },
        });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map