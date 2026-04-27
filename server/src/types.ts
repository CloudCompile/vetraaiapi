/**
 * Vetra API Server Types
 * OpenAI-compatible types for chat completions
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string | null;
  name?: string;
  function_call?: any;
  tool_calls?: any[];
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stream?: boolean;
  seed?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string | string[];
  user?: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatCompletionChoice {
  index: number;
  message: {
    role: 'assistant';
    content: string | null;
    tool_calls?: any[];
  };
  finish_reason: string | null;
}

export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string | null;
      tool_calls?: any[];
    };
    finish_reason: string | null;
  }[];
}

export interface ModelInfo {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
}

export interface ApiError {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string;
  };
}

export interface RateLimitInfo {
  remaining: number;
  resetAt: number;
  limit: number;
}

// Roleplay-specific request extensions
export interface RoleplayRequest extends ChatCompletionRequest {
  // Character context injection
  character?: {
    name: string;
    description?: string;
    personality?: string;
    scenario?: string;
    first_message?: string;
  };
  // Memory/worldbook
  memory?: string[];
  // Jailbreak / system override
  jailbreak?: string;
}
