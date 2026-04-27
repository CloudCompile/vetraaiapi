/**
 * Vetra API Server - Request Validation
 * Zod schemas for validating incoming requests
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export declare const ChatCompletionRequestSchema: z.ZodObject<{
    model: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant", "function", "tool"]>;
        content: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNull]>>>;
        name: z.ZodOptional<z.ZodString>;
        function_call: z.ZodOptional<z.ZodAny>;
        tool_calls: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content: string | null;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }, {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content?: string | null | undefined;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }>, "many">;
    temperature: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    seed: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    presence_penalty: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    stop: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    user: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model: string;
    stream: boolean;
    messages: {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content: string | null;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }[];
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    user?: string | undefined;
    max_tokens?: number | undefined;
    seed?: number | undefined;
    stop?: string | string[] | undefined;
}, {
    model: string;
    messages: {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content?: string | null | undefined;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }[];
    user?: string | undefined;
    stream?: boolean | undefined;
    temperature?: number | undefined;
    max_tokens?: number | undefined;
    top_p?: number | undefined;
    seed?: number | undefined;
    frequency_penalty?: number | undefined;
    presence_penalty?: number | undefined;
    stop?: string | string[] | undefined;
}>;
export declare const RoleplayRequestSchema: z.ZodObject<{
    model: z.ZodString;
    messages: z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant", "function", "tool"]>;
        content: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNull]>>>;
        name: z.ZodOptional<z.ZodString>;
        function_call: z.ZodOptional<z.ZodAny>;
        tool_calls: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    }, "strip", z.ZodTypeAny, {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content: string | null;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }, {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content?: string | null | undefined;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }>, "many">;
    temperature: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    max_tokens: z.ZodOptional<z.ZodNumber>;
    top_p: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    seed: z.ZodOptional<z.ZodNumber>;
    frequency_penalty: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    presence_penalty: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    stop: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>>;
    user: z.ZodOptional<z.ZodString>;
} & {
    character: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        personality: z.ZodOptional<z.ZodString>;
        scenario: z.ZodOptional<z.ZodString>;
        first_message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description?: string | undefined;
        personality?: string | undefined;
        scenario?: string | undefined;
        first_message?: string | undefined;
    }, {
        name: string;
        description?: string | undefined;
        personality?: string | undefined;
        scenario?: string | undefined;
        first_message?: string | undefined;
    }>>;
    memory: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    jailbreak: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    model: string;
    stream: boolean;
    messages: {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content: string | null;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }[];
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    user?: string | undefined;
    max_tokens?: number | undefined;
    seed?: number | undefined;
    stop?: string | string[] | undefined;
    character?: {
        name: string;
        description?: string | undefined;
        personality?: string | undefined;
        scenario?: string | undefined;
        first_message?: string | undefined;
    } | undefined;
    memory?: string[] | undefined;
    jailbreak?: string | undefined;
}, {
    model: string;
    messages: {
        role: "function" | "system" | "user" | "assistant" | "tool";
        content?: string | null | undefined;
        name?: string | undefined;
        function_call?: any;
        tool_calls?: any[] | undefined;
    }[];
    user?: string | undefined;
    stream?: boolean | undefined;
    temperature?: number | undefined;
    max_tokens?: number | undefined;
    top_p?: number | undefined;
    seed?: number | undefined;
    frequency_penalty?: number | undefined;
    presence_penalty?: number | undefined;
    stop?: string | string[] | undefined;
    character?: {
        name: string;
        description?: string | undefined;
        personality?: string | undefined;
        scenario?: string | undefined;
        first_message?: string | undefined;
    } | undefined;
    memory?: string[] | undefined;
    jailbreak?: string | undefined;
}>;
export declare function validateChatCompletion(req: Request, res: Response, next: NextFunction): void;
export declare function validateMessages(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=validation.d.ts.map