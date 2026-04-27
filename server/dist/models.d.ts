/**
 * Vetra API Server - Model Definitions
 * Free-tier models via OpenRouter (and other free providers)
 */
export interface ChatModel {
    id: string;
    name: string;
    provider: 'openrouter' | 'groq' | 'cerebras' | 'pollinations' | 'github' | 'local';
    description?: string;
    contextWindow?: number;
    tags?: string[];
}
export declare const OPENROUTER_FREE_MODELS: ChatModel[];
export declare const modelAliases: Record<string, string>;
export declare const CHAT_MODELS: ChatModel[];
export declare function getModelById(modelId: string): ChatModel | undefined;
export declare function resolveModelId(modelId: string): string;
export declare function modelExists(modelId: string): boolean;
//# sourceMappingURL=models.d.ts.map