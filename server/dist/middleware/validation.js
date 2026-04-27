"use strict";
/**
 * Vetra API Server - Request Validation
 * Zod schemas for validating incoming requests
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleplayRequestSchema = exports.ChatCompletionRequestSchema = void 0;
exports.validateChatCompletion = validateChatCompletion;
exports.validateMessages = validateMessages;
const zod_1 = require("zod");
// Chat completion request schema (OpenAI-compatible)
exports.ChatCompletionRequestSchema = zod_1.z.object({
    model: zod_1.z.string().min(1, 'model is required'),
    messages: zod_1.z.array(zod_1.z.object({
        role: zod_1.z.enum(['system', 'user', 'assistant', 'function', 'tool'], {
            errorMap: () => ({ message: 'role must be one of: system, user, assistant, function, tool' }),
        }),
        content: zod_1.z.union([zod_1.z.string(), zod_1.z.null()]).optional().default(''),
        name: zod_1.z.string().optional(),
        function_call: zod_1.z.any().optional(),
        tool_calls: zod_1.z.array(zod_1.z.any()).optional(),
    })).min(1, 'messages array cannot be empty'),
    temperature: zod_1.z.number().min(0).max(2).optional().default(0.7),
    max_tokens: zod_1.z.number().int().positive().optional(),
    top_p: zod_1.z.number().min(0).max(1).optional().default(1),
    stream: zod_1.z.boolean().optional().default(false),
    seed: zod_1.z.number().int().optional(),
    frequency_penalty: zod_1.z.number().min(-2).max(2).optional().default(0),
    presence_penalty: zod_1.z.number().min(-2).max(2).optional().default(0),
    stop: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]).optional(),
    user: zod_1.z.string().optional(),
});
// Roleplay request extensions
exports.RoleplayRequestSchema = exports.ChatCompletionRequestSchema.extend({
    character: zod_1.z.object({
        name: zod_1.z.string(),
        description: zod_1.z.string().optional(),
        personality: zod_1.z.string().optional(),
        scenario: zod_1.z.string().optional(),
        first_message: zod_1.z.string().optional(),
    }).optional(),
    memory: zod_1.z.array(zod_1.z.string()).optional(),
    jailbreak: zod_1.z.string().optional(),
});
function validateChatCompletion(req, res, next) {
    const result = exports.ChatCompletionRequestSchema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        res.status(400).json({
            error: {
                message: `Invalid request: ${errors}`,
                type: 'invalid_request_error',
                param: result.error.errors[0]?.path.join('.') || null,
                code: 'invalid_request',
            },
        });
        return;
    }
    next();
}
// Message validation (roleplay-friendly limits)
const MAX_MESSAGE_LENGTH = 10000000; // 10MB per message
const MAX_TOTAL_LENGTH = 50000000; // 50MB total
const MAX_MESSAGES_COUNT = 2000;
function validateMessages(req, res, next) {
    const messages = req.body.messages;
    if (!messages || !Array.isArray(messages)) {
        res.status(400).json({
            error: {
                message: 'messages array is required',
                type: 'invalid_request_error',
                param: 'messages',
                code: 'invalid_messages',
            },
        });
        return;
    }
    if (messages.length === 0) {
        res.status(400).json({
            error: {
                message: 'messages array cannot be empty',
                type: 'invalid_request_error',
                param: 'messages',
                code: 'invalid_messages',
            },
        });
        return;
    }
    if (messages.length > MAX_MESSAGES_COUNT) {
        res.status(400).json({
            error: {
                message: `messages array exceeds maximum of ${MAX_MESSAGES_COUNT} messages`,
                type: 'invalid_request_error',
                param: 'messages',
                code: 'too_many_messages',
            },
        });
        return;
    }
    let totalLength = 0;
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (!msg || typeof msg !== 'object') {
            res.status(400).json({
                error: {
                    message: `messages[${i}] must be an object`,
                    type: 'invalid_request_error',
                    param: `messages[${i}]`,
                    code: 'invalid_message_format',
                },
            });
            return;
        }
        if (!msg.role || typeof msg.role !== 'string') {
            res.status(400).json({
                error: {
                    message: `messages[${i}].role must be a string`,
                    type: 'invalid_request_error',
                    param: `messages[${i}].role`,
                    code: 'invalid_message_role',
                },
            });
            return;
        }
        const validRoles = ['system', 'user', 'assistant', 'function', 'tool'];
        if (!validRoles.includes(msg.role)) {
            res.status(400).json({
                error: {
                    message: `messages[${i}].role must be one of: ${validRoles.join(', ')}`,
                    type: 'invalid_request_error',
                    param: `messages[${i}].role`,
                    code: 'invalid_message_role',
                },
            });
            return;
        }
        if (msg.content !== null && msg.content !== undefined) {
            const contentLength = typeof msg.content === 'string'
                ? msg.content.length
                : JSON.stringify(msg.content).length;
            if (contentLength > MAX_MESSAGE_LENGTH) {
                res.status(400).json({
                    error: {
                        message: `Message at index ${i} is too long (${contentLength} chars). Maximum allowed per message is ${MAX_MESSAGE_LENGTH} characters.`,
                        type: 'invalid_request_error',
                        param: `messages[${i}].content`,
                        code: 'message_too_long',
                    },
                });
                return;
            }
            totalLength += contentLength;
        }
    }
    if (totalLength > MAX_TOTAL_LENGTH) {
        res.status(400).json({
            error: {
                message: `Total conversation length (${totalLength} chars) exceeds the maximum allowed limit of ${MAX_TOTAL_LENGTH} characters.`,
                type: 'invalid_request_error',
                param: 'messages',
                code: 'conversation_too_long',
            },
        });
        return;
    }
    next();
}
//# sourceMappingURL=validation.js.map