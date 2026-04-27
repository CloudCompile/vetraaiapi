/**
 * Vetra API Server - OpenRouter Provider Integration
 * Handles requests to OpenRouter's free-tier models with key rotation
 */
import { ChatCompletionRequest, ChatCompletionResponse } from '../types';
export interface ProviderResponse {
    data: ChatCompletionResponse | null;
    stream: ReadableStream<Uint8Array> | null;
    error: {
        message: string;
        type: string;
        code: string;
    } | null;
    status: number;
    headers: Record<string, string>;
}
export declare function createChatCompletion(request: ChatCompletionRequest, requestId: string): Promise<ProviderResponse>;
//# sourceMappingURL=openrouter.d.ts.map