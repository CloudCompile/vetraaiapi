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

// Free models available through OpenRouter
// All OpenRouter free-tier models have :free suffix
export const OPENROUTER_FREE_MODELS: ChatModel[] = [
  { id: 'qwen/qwen3.6-plus:free', name: 'Qwen3.6 Plus (free)', provider: 'openrouter', description: 'Qwen Qwen3.6 Plus free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'stepfun/step-3.5-flash:free', name: 'Step 3.5 Flash (free)', provider: 'openrouter', description: 'StepFun Step 3.5 Flash free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'nvidia/nemotron-3-super:free', name: 'Nemotron 3 Super (free)', provider: 'openrouter', description: 'NVIDIA Nemotron 3 Super free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'arcee-ai/trinity-large-preview:free', name: 'Trinity Large Preview (free)', provider: 'openrouter', description: 'Arcee AI Trinity Large Preview free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'z-ai/glm-4.5-air:free', name: 'GLM 4.5 Air (free)', provider: 'openrouter', description: 'Z.ai GLM 4.5 Air free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano 30B A3B (free)', provider: 'openrouter', description: 'NVIDIA Nemotron 3 Nano 30B A3B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'arcee-ai/trinity-mini:free', name: 'Trinity Mini (free)', provider: 'openrouter', description: 'Arcee AI Trinity Mini free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B V2 VL (free)', provider: 'openrouter', description: 'NVIDIA Nemotron Nano 12B V2 VL free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'minimax/minimax-m2.5:free', name: 'MiniMax M2.5 (free)', provider: 'openrouter', description: 'MiniMax M2.5 free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B V2 (free)', provider: 'openrouter', description: 'NVIDIA Nemotron Nano 9B V2 free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS 120B (free)', provider: 'openrouter', description: 'OpenAI GPT-OSS 120B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'qwen/qwen3-coder-480b-a35b:free', name: 'Qwen3 Coder 480B A35B (free)', provider: 'openrouter', description: 'Qwen Qwen3 Coder 480B A35B free', contextWindow: 128, tags: ['chat', 'free', 'coding'] },
  { id: 'openai/gpt-oss-20b:free', name: 'GPT-OSS 20B (free)', provider: 'openrouter', description: 'OpenAI GPT-OSS 20B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'qwen/qwen3-next-80b-a3b-instruct:free', name: 'Qwen3 Next 80B A3B Instruct (free)', provider: 'openrouter', description: 'Qwen Qwen3 Next 80B A3B Instruct free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B (free)', provider: 'openrouter', description: 'Google Gemma 3 27B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'google/gemma-3-4b-it:free', name: 'Gemma 3 4B (free)', provider: 'openrouter', description: 'Google Gemma 3 4B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B (free)', provider: 'openrouter', description: 'Google Gemma 3 12B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'google/gemma-3n-e2b-it:free', name: 'Gemma 3n 2B (free)', provider: 'openrouter', description: 'Google Gemma 3n 2B free', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'xiaomi/mimo-v2-flash:free', name: 'Xiaomi Mimo V2 Flash', provider: 'openrouter', description: 'Xiaomi Mimo V2 Flash model', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'mistralai/devstral-2512:free', name: 'Mistral Devstral 2512', provider: 'openrouter', description: 'Mistral AI Devstral 2512', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'kwaipilot/kat-coder-pro:free', name: 'Kwai KAT Coder Pro', provider: 'openrouter', description: 'Kwai Pilot KAT Coder Pro', contextWindow: 128, tags: ['chat', 'free', 'coding'] },
  { id: 'nex-agi/deepseek-v3.1-nex-n1:free', name: 'Nex DeepSeek V3.1 Nex N1', provider: 'openrouter', description: 'Nex AGI DeepSeek V3.1 Nex N1', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'tngtech/deepseek-r1t2-chimera:free', name: 'TNG DeepSeek R1T2 Chimera', provider: 'openrouter', description: 'TNG Tech DeepSeek R1T2 Chimera', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'tngtech/deepseek-r1t-chimera:free', name: 'TNG DeepSeek R1T Chimera', provider: 'openrouter', description: 'TNG Tech DeepSeek R1T Chimera', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'tngtech/tng-r1t-chimera:free', name: 'TNG R1T Chimera', provider: 'openrouter', description: 'TNG Tech R1T Chimera', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 0528', provider: 'openrouter', description: 'DeepSeek R1 0528 model', contextWindow: 128, tags: ['chat', 'free', 'reasoning'] },
  { id: 'qwen/qwen3-coder:free', name: 'Qwen 3 Coder', provider: 'openrouter', description: 'Qwen 3 Coder model', contextWindow: 128, tags: ['chat', 'free', 'coding'] },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Meta Llama 3.3 70B Instruct', provider: 'openrouter', description: 'Meta Llama 3.3 70B Instruct', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Google Gemini 2.0 Flash Exp', provider: 'openrouter', description: 'Google Gemini 2.0 Flash Experimental', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B Venice', provider: 'openrouter', description: 'Cognitive Computations Dolphin Mistral 24B Venice Edition', contextWindow: 128, tags: ['chat', 'free', 'roleplay'] },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 Llama 3.1 405B', provider: 'openrouter', description: 'Nous Research Hermes 3 Llama 3.1 405B', contextWindow: 128, tags: ['chat', 'free', 'roleplay'] },
  { id: 'meta-llama/llama-3.1-405b-instruct:free', name: 'Meta Llama 3.1 405B Instruct', provider: 'openrouter', description: 'Meta Llama 3.1 405B Instruct', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B Instruct', provider: 'openrouter', description: 'Mistral AI 7B Instruct', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B Instruct', provider: 'openrouter', description: 'Mistral AI Small 3.1 24B Instruct', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'qwen/qwen3-4b:free', name: 'Qwen 3 4B', provider: 'openrouter', description: 'Qwen 3 4B model', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Meta Llama 3.2 3B Instruct', provider: 'openrouter', description: 'Meta Llama 3.2 3B Instruct', contextWindow: 128, tags: ['chat', 'free'] },
  { id: 'qwen/qwen-2.5-vl-7b-instruct:free', name: 'Qwen 2.5 VL 7B Instruct', provider: 'openrouter', description: 'Qwen 2.5 Vision-Language 7B Instruct', contextWindow: 128, tags: ['chat', 'free', 'vision'] },
];

// Simple aliases for easier model selection
export const modelAliases: Record<string, string> = {
  'gpt-4o': 'openai/gpt-oss-120b:free',
  'gpt-4': 'openai/gpt-oss-120b:free',
  'gpt-3.5': 'openai/gpt-oss-20b:free',
  'claude': 'mistralai/mistral-small-3.1-24b-instruct:free',
  'gemini': 'google/gemini-2.0-flash-exp:free',
  'deepseek': 'deepseek/deepseek-r1-0528:free',
  'llama': 'meta-llama/llama-3.3-70b-instruct:free',
  'mistral': 'mistralai/mistral-small-3.1-24b-instruct:free',
  'qwen': 'qwen/qwen3.6-plus:free',
  'dolphin': 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free',
  'hermes': 'nousresearch/hermes-3-llama-3.1-405b:free',
  // Short aliases
  'openai': 'openai/gpt-oss-120b:free',
  'openai-fast': 'openai/gpt-oss-20b:free',
  'openai-large': 'openai/gpt-oss-120b:free',
  'default': 'qwen/qwen3.6-plus:free',
};

// Build the final CHAT_MODELS array
export const CHAT_MODELS: ChatModel[] = [...OPENROUTER_FREE_MODELS];

// Model lookup by ID
export function getModelById(modelId: string): ChatModel | undefined {
  const resolvedId = resolveModelId(modelId);
  return CHAT_MODELS.find(m => m.id === resolvedId);
}

// Resolve model ID (apply aliases)
export function resolveModelId(modelId: string): string {
  const normalized = modelId.trim().toLowerCase().replace(/^['"]+|['"]+$/g, '');
  return modelAliases[normalized] || normalized;
}

// Check if model exists
export function modelExists(modelId: string): boolean {
  return getModelById(modelId) !== undefined;
}
