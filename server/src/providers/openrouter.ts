/**
 * Vetra API Server - OpenRouter Provider Integration
 * Handles requests to OpenRouter's free-tier models with key rotation
 */

import { config } from '../config';
import { ChatCompletionRequest, ChatCompletionResponse, ChatCompletionChunk } from '../types';
import { resolveModelId } from '../models';

// Key rotation state
let currentKeyIndex = 0;

function getNextOpenRouterKey(): string | undefined {
  if (config.openRouterKeys.length === 0) return undefined;
  const key = config.openRouterKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % config.openRouterKeys.length;
  return key;
}

function getAllKeys(): string[] {
  return [...config.openRouterKeys];
}

function generateRequestId(): string {
  return `chatcmpl-${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
}

function generateRotatingIp(): string {
  const octet = () => Math.floor(Math.random() * 256);
  return `${octet()}.${octet()}.${octet()}.${octet()}`;
}

export interface ProviderResponse {
  data: ChatCompletionResponse | null;
  stream: ReadableStream<Uint8Array> | null;
  error: { message: string; type: string; code: string } | null;
  status: number;
  headers: Record<string, string>;
}

export async function createChatCompletion(
  request: ChatCompletionRequest,
  requestId: string
): Promise<ProviderResponse> {
  const modelId = resolveModelId(request.model);
  const apiKey = getNextOpenRouterKey();

  if (!apiKey) {
    return {
      data: null,
      stream: null,
      error: {
        message: 'OpenRouter API key is not configured. Please set OPENROUTER_API_KEY environment variable.',
        type: 'config_error',
        code: 'missing_api_key',
      },
      status: 500,
      headers: {},
    };
  }

  // Build request body
  const maxTokensSafetyCap = config.maxTokensSafetyCap;
  const defaultMaxTokens = config.defaultMaxTokens;
  const effectiveMaxTokens = request.max_tokens
    ? Math.min(request.max_tokens, maxTokensSafetyCap)
    : defaultMaxTokens;

  const body: any = {
    model: modelId,
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: effectiveMaxTokens,
    stream: request.stream ?? false,
    top_p: request.top_p ?? 1,
  };

  if (request.seed !== undefined) body.seed = request.seed;
  if (request.frequency_penalty !== undefined && request.frequency_penalty !== 0) {
    body.frequency_penalty = request.frequency_penalty;
  }
  if (request.presence_penalty !== undefined && request.presence_penalty !== 0) {
    body.presence_penalty = request.presence_penalty;
  }
  if (request.stop !== undefined) body.stop = request.stop;
  if (request.user !== undefined) body.user = request.user;

  // Convert developer role to system for OpenRouter compatibility
  body.messages = body.messages.map((msg: any) => {
    if (msg.role === 'developer') {
      return { ...msg, role: 'system' };
    }
    return msg;
  });

  // Truncate if too long (180k char buffer)
  const MAX_PROVIDER_CHARS = 180000;
  const totalInputChars = JSON.stringify(body.messages).length;
  if (totalInputChars > MAX_PROVIDER_CHARS) {
    console.log(`[${requestId}] Input too long (${totalInputChars} chars), truncating...`);
    const systemMsgIdx = body.messages.findIndex((m: any) => m.role === 'system');
    if (systemMsgIdx !== -1) {
      const systemMsg = body.messages[systemMsgIdx];
      const otherMessages = body.messages.filter((_: any, i: number) => i !== systemMsgIdx);
      const allowedChars = MAX_PROVIDER_CHARS - JSON.stringify(systemMsg).length - 100;
      let usedChars = 0;
      const kept: any[] = [];
      for (let i = otherMessages.length - 1; i >= 0; i--) {
        const msgJson = JSON.stringify(otherMessages[i]);
        if (usedChars + msgJson.length > allowedChars) break;
        kept.unshift(otherMessages[i]);
        usedChars += msgJson.length;
      }
      body.messages = [systemMsg, ...kept];
    } else {
      const allowedChars = MAX_PROVIDER_CHARS - 100;
      let usedChars = 0;
      const kept: any[] = [];
      for (let i = body.messages.length - 1; i >= 0; i--) {
        const msgJson = JSON.stringify(body.messages[i]);
        if (usedChars + msgJson.length > allowedChars) break;
        kept.unshift(body.messages[i]);
        usedChars += msgJson.length;
      }
      body.messages = kept;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://vetraai.vercel.app',
    'X-Title': 'Vetra',
    'X-Forwarded-For': generateRotatingIp(),
    'X-Real-IP': generateRotatingIp(),
  };

  try {
    const response = await fetch(config.openRouterUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(config.providerTimeoutMs),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[${requestId}] OpenRouter error (${response.status}):`, errorText.substring(0, 500));

      // Try fallback keys for rate limit / auth errors
      if ((response.status === 429 || response.status === 401 || response.status === 403) && config.openRouterKeys.length > 1) {
        const fallbackKeys = getAllKeys().filter(k => k !== apiKey);
        for (const fallbackKey of fallbackKeys) {
          console.log(`[${requestId}] Trying fallback OpenRouter key...`);
          try {
            const fallbackResponse = await fetch(config.openRouterUrl, {
              method: 'POST',
              headers: { ...headers, Authorization: `Bearer ${fallbackKey}` },
              body: JSON.stringify(body),
              signal: AbortSignal.timeout(config.providerTimeoutMs),
            });

            if (fallbackResponse.ok) {
              console.log(`[${requestId}] Fallback key succeeded`);
              if (request.stream) {
                return {
                  data: null,
                  stream: fallbackResponse.body,
                  error: null,
                  status: 200,
                  headers: Object.fromEntries(fallbackResponse.headers.entries()),
                };
              }
              const data = await fallbackResponse.json() as ChatCompletionResponse;
              data.model = request.model;
              data.object = 'chat.completion';
              return {
                data,
                stream: null,
                error: null,
                status: 200,
                headers: {},
              };
            }
          } catch (e) {
            console.warn(`[${requestId}] Fallback key failed:`, e);
          }
        }
      }

      let errorMessage = errorText;
      let errorCode = 'upstream_error';
      let mappedStatus = response.status;

      if (response.status === 429) {
        mappedStatus = 429;
        errorMessage = 'Rate limit exceeded for the upstream provider. Please wait a moment and try again.';
        errorCode = 'rate_limit_exceeded';
      } else if (response.status === 504 || response.status === 503) {
        mappedStatus = 503;
        errorMessage = 'The upstream provider is temporarily unavailable or overloaded. Please try again in a few moments.';
        errorCode = 'provider_timeout';
      } else if (response.status >= 500) {
        mappedStatus = 503;
        errorMessage = 'Server error from upstream provider. This usually resolves quickly. Please try again.';
        errorCode = 'provider_server_error';
      } else if (response.status === 401 || response.status === 403) {
        mappedStatus = 503;
        errorMessage = 'The upstream provider is temporarily unavailable. Please try a different model or try again later.';
        errorCode = 'provider_unavailable';
      } else if (response.status === 400) {
        errorMessage = `Invalid request format. ${errorText.substring(0, 200)}`;
        errorCode = 'invalid_request';
      }

      return {
        data: null,
        stream: null,
        error: { message: errorMessage, type: 'api_error', code: errorCode },
        status: mappedStatus,
        headers: {},
      };
    }

    // Success
    if (request.stream && response.body) {
      return {
        data: null,
        stream: response.body,
        error: null,
        status: 200,
        headers: Object.fromEntries(response.headers.entries()),
      };
    }

    const data = await response.json() as ChatCompletionResponse;
    // Normalize response
    data.model = request.model;
    data.object = 'chat.completion';

    return {
      data,
      stream: null,
      error: null,
      status: 200,
      headers: {},
    };

  } catch (fetchError: any) {
    console.error(`[${requestId}] Fetch error:`, fetchError);
    return {
      data: null,
      stream: null,
      error: {
        message: `Failed to connect to provider: ${fetchError.message}`,
        type: 'network_error',
        code: 'fetch_failed',
      },
      status: 502,
      headers: {},
    };
  }
}
