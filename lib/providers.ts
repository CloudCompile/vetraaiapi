// AI Provider configurations and model definitions

export interface ChatModel {
  id: string;
  name: string;
  provider: 'pollinations' | 'stablehorde';
  description?: string;
  contextWindow?: number;
  downtimeUntil?: string; // ISO timestamp for maintenance countdown
  usageWeight?: number; // How many "requests" this model counts as for daily limits
}

export interface ImageModel {
  id: string;
  name: string;
  provider: 'pollinations' | 'stablehorde';
  description?: string;
  downtimeUntil?: string; // ISO timestamp for maintenance countdown
  usageWeight?: number; // How many "requests" this model counts as for daily limits
}

export interface VideoModel {
  id: string;
  name: string;
  provider: 'pollinations' | 'stablehorde';
  description?: string;
  maxDuration?: number;
  downtimeUntil?: string; // ISO timestamp for maintenance countdown
  usageWeight?: number; // How many "requests" this model counts as for daily limits
}

// Available chat models by provider
const POLLINATIONS_CHAT_MODELS: ChatModel[] = [
  { id: 'deepseek', name: 'DeepSeek V3.2', provider: 'pollinations', description: 'DeepSeek V3.2', contextWindow: 400, usageWeight: 10 },
  { id: 'chickytutor', name: 'ChickyTutor AI Language Tutor', provider: 'pollinations', description: 'ChickyTutor AI Language Tutor', contextWindow: 200, usageWeight: 5 },
  { id: 'kimi-k2-thinking', name: 'Moonshot Kimi K2 Thinking', provider: 'pollinations', description: 'Moonshot Kimi K2 Thinking', contextWindow: 200, usageWeight: 15 },
  { id: 'openai-audio', name: 'OpenAI GPT-4o Mini Audio', provider: 'pollinations', description: 'OpenAI GPT-4o Mini Audio', contextWindow: 150, usageWeight: 5 },
  { id: 'midijourney', name: 'MIDIjourney', provider: 'pollinations', description: 'MIDIjourney', contextWindow: 150, usageWeight: 20 },
  { id: 'glm', name: 'Z.ai GLM-4.7', provider: 'pollinations', description: 'Z.ai GLM-4.7', contextWindow: 150, usageWeight: 10 },
  { id: 'minimax', name: 'MiniMax M2.1', provider: 'pollinations', description: 'MiniMax M2.1', contextWindow: 150, usageWeight: 8 },
  { id: 'openai-large', name: 'OpenAI GPT-5.2', provider: 'pollinations', description: 'OpenAI GPT-5.2', contextWindow: 100, usageWeight: 40 },
  { id: 'perplexity-reasoning', name: 'Perplexity Sonar Reasoning', provider: 'pollinations', description: 'Perplexity Sonar Reasoning', contextWindow: 100, usageWeight: 25 },
  { id: 'nova-fast', name: 'Amazon Nova Micro', provider: 'pollinations', description: 'Amazon Nova Micro', contextWindow: 24400, usageWeight: 1 },
  { id: 'mistral', name: 'Mistral Small 3.2 24B', provider: 'pollinations', description: 'Mistral Small 3.2 24B', contextWindow: 2000, usageWeight: 1 },
  { id: 'qwen-coder', name: 'Qwen3 Coder 30B', provider: 'pollinations', description: 'Qwen3 Coder 30B', contextWindow: 1600, usageWeight: 1 },
  { id: 'grok', name: 'xAI Grok 4 Fast', provider: 'pollinations', description: 'xAI Grok 4 Fast', contextWindow: 900, usageWeight: 1 },
  { id: 'openai', name: 'OpenAI GPT-5 Mini', provider: 'pollinations', description: 'OpenAI GPT-5 Mini', contextWindow: 750, usageWeight: 1 },
  { id: 'perplexity-fast', name: 'Perplexity Sonar', provider: 'pollinations', description: 'Perplexity Sonar', contextWindow: 750, usageWeight: 1 },
  { id: 'openai-fast', name: 'OpenAI GPT-5 Nano', provider: 'pollinations', description: 'OpenAI GPT-5 Nano', contextWindow: 700, usageWeight: 1 },
];







export const STABLEHORDE_CHAT_MODELS: ChatModel[] = [];










export const CHAT_MODELS: ChatModel[] = [];

// Premium models that require a subscription
export const PREMIUM_MODELS = new Set([
  // Flagship & Next-Gen Chat (User specified Premium)
  'deepseek',
  'gemini-search',
  'chickytutor',
  'kimi-k2-thinking',
  'openai-audio',
  'gemini',
  'midijourney',
  'glm',
  'minimax',
  'openai-large',
  'perplexity-reasoning',
  'claude-fast',
  'claude',
  'gemini-large',
  'claude-large',

  // Other Existing Premium Models
  'gemini-2.5-pro',
  'gemini-3-pro-preview',
  
  // Reasoning & Specialized
  'deepseek-r1',
  'meridian',
  
  // GitHub Premium Models
  'AI21-Jamba-1.5-Large',
  'Phi-4-reasoning',
  'o4-mini',
  'o3-mini',
  'o3',
  'o1-preview',
  'o1-mini',
  'o1',
  'gpt-5-chat',
  'gpt-5',
  'gpt-4.1-mini',
  'gpt-4.1',
  'Meta-Llama-3.1-405B-Instruct',
  'MAI-DS-R1',
  'Llama-3.3-70B-Instruct',
  'Llama-3.2-90B-Vision-Instruct',
  'Llama-4-Scout-17B-16E-Instruct',
  'Llama-4-Maverick-17B-128E-Instruct-FP8',
  'Cohere-command-r-plus-08-2024',
  'Mistral-medium-3-25.05',
  'DeepSeek-V3-0324',
  
  // Poe Premium Models
  'claude-sonnet-3.5',
  'claude-haiku-3.5',
  'claude-opus-4',
  'gpt-4o',
  'o1',
  'o1-mini',
  'o1-pro',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'llama-3.1-405b-fp16',
  'llama-3.3-70b',
  'deepseek-v3',
  'deepseek-r1',
  'mistral-large-2',
  'grok-4-fast-non-reasoning',
  
  // Video (All)
  'veo',
  'seedance',
  'seedance-pro',
  
  // High-Res Image
  'nanobanana-pro',
  'seedream-pro',
  'gptimage-large'
]);

// Available image models
export const IMAGE_MODELS: ImageModel[] = [];

// Available video models
export const VIDEO_MODELS: VideoModel[] = [];

// Provider base URLs
export const PROVIDER_URLS = {
  pollinations: 'https://gen.pollinations.ai',
  openrouter: 'https://openrouter.ai',
  appypie: {
    sdxl: 'https://gateway.appypie.com/getImage/v1/getSDXLImage',
    inpainting: 'https://gateway-stable-diffusion-v1-5-inpainting.appypie.workers.dev/getImage',
    fluxSchnell: 'https://gateway.pixazo.ai/flux-1-schnell/v1/getData',
  },
  stablehorde: 'https://stablehorde.net/api/v2',
  github: 'https://models.inference.ai.azure.com',
  poe: 'https://api.poe.com/v1',
};