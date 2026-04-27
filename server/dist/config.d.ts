/**
 * Vetra API Server Configuration
 */
export declare const config: {
    port: number;
    nodeEnv: string;
    corsOrigins: string[];
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
    providerTimeoutMs: number;
    systemApiKey: string;
    openRouterKeys: string[];
    openRouterUrl: string;
    openRouterModelsUrl: string;
    maxTokensSafetyCap: number;
    defaultMaxTokens: number;
    maxMessageLength: number;
    maxTotalLength: number;
    maxMessagesCount: number;
};
export declare function validateConfig(): void;
//# sourceMappingURL=config.d.ts.map