# Vetra API Documentation

> A free AI API for roleplayers, powered by OpenRouter.

## Overview

Vetra is an OpenAI-compatible chat API built specifically for the roleplay community. No credit card required, no quotas—just bring your characters and start creating stories.

### Key Features

- 🎭 **Character Context** — Persist character personalities across sessions
- 💬 **Conversation Memory** — Long-form context windows for ongoing stories  
- ⚡ **Persona Switching** — Seamlessly swap between characters
- 🔄 **OpenAI Compatible** — Drop-in replacement for existing apps

## Base URL

```
https://vetra-api.onrender.com
```

## Authentication

All API requests require an `x-api-key` header:

```bash
curl https://vetra-api.onrender.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-api-key: vetra-free-key-001" \
  -d '{"model": "openrouter/auto", "messages": [{"role": "user", "content": "Hello"}]}'
```

### Getting an API Key

Use the free test key for development: `vetra-free-key-001`

## Endpoints

### Health Check

```
GET /health
```

Returns the service status.

**Response:**
```json
{
  "status": "ok",
  "service": "vetra-api", 
  "version": "1.0.0"
}
```

### List Models

```
GET /v1/models
```

Returns available models. Use `openrouter/auto` for automatic selection.

**Headers:** `x-api-key: <your-key>`

### Chat Completions

```
POST /v1/chat/completions
```

Send a chat completion request. Compatible with OpenAI's API.

**Headers:** `x-api-key: <your-key>`

**Request Body:**
```json
{
  "model": "openrouter/auto",
  "messages": [
    {"role": "system", "content": "You are a wise dragon in a fantasy realm."},
    {"role": "user", "content": "Tell me about your hoard."}
  ],
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 1024
}
```

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `model` | string | required | Model ID (use `openrouter/auto`) |
| `messages` | array | required | Conversation history |
| `stream` | boolean | false | Enable SSE streaming |
| `temperature` | number | 0.7 | Creativity (0-2) |
| `max_tokens` | integer | 1024 | Max response length |
| `top_p` | number | 1 | Nucleus sampling |
| `presence_penalty` | number | 0 | Repeat token penalty |
| `frequency_penalty` | number | 0 | Frequent token penalty |

### Streaming Responses

Set `stream: true` to receive Server-Sent Events:

```bash
curl -N -X POST https://vetra-api.onrender.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-api-key: vetra-free-key-001" \
  -d '{"model": "openrouter/auto", "messages": [{"role": "user", "content": "Hello"}], "stream": true}'
```

## For Roleplayers

### Building Characters

Create consistent characters by using system prompts:

```json
{
  "model": "openrouter/auto",
  "messages": [
    {
      "role": "system", 
      "content": "You are Eldric the Wise, an ancient elven sorcerer who speaks in archaic English and loves riddles. You are somewhat pompous but ultimately kind-hearted."
    },
    {"role": "user", "content": "Greetings, mage. What brings you to these lands?"}
  ]
}
```

### Maintaining Context

Include conversation history in the `messages` array:

```json
{
  "messages": [
    {"role": "system", "content": "You are a pirate captain."},
    {"role": "user", "content": "What's yer name, captain?"},
    {"role": "assistant", "content": "Arr, I be Captain Blackhand! Twice-crossed the Silver Seas and thrice survived the Davy Jones' locker!"},
    {"role": "user", "content": "Tell me about yer adventures."}
  ]
}
```

### Persona Switching

To switch characters mid-conversation, simply change the system prompt:

```json
{
  "messages": [
    {"role": "system", "content": "You are NOW Captain Blackhand's first mate, a cunning halfling named Pip."},
    {"role": "user", "content": "What do ye think of the captain?"}
  ]
}
```

## Error Handling

| Status | Meaning |
|--------|---------|
| 400 | Bad request - invalid JSON or missing fields |
| 401 | Missing x-api-key header |
| 403 | Invalid API key |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

## Rate Limits

- **Free tier**: 100 requests/day
- Response includes rate limit headers

## Code Examples

### JavaScript/TypeScript

```typescript
const response = await fetch('https://vetra-api.onrender.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'vetra-free-key-001'
  },
  body: JSON.stringify({
    model: 'openrouter/auto',
    messages: [
      { role: 'system', content: 'You are a helpful RPG assistant.' },
      { role: 'user', content: 'Create a tavern scene for me.' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

### Python

```python
import requests

response = requests.post(
    'https://vetra-api.onrender.com/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'x-api-key': 'vetra-free-key-001'
    },
    json={
        'model': 'openrouter/auto',
        'messages': [
            {'role': 'system', 'content': 'You are a helpful RPG assistant.'},
            {'role': 'user', 'content': 'Create a tavern scene for me.'}
        ]
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

### cURL

```bash
curl https://vetra-api.onrender.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "x-api-key: vetra-free-key-001" \
  -d '{
    "model": "openrouter/auto",
    "messages": [
      {"role": "system", "content": "You are a creative storyteller."},
      {"role": "user", "content": "Write a short fantasy scene."}
    ]
  }'
```

## Available Models

| Model ID | Description |
|----------|-------------|
| `openrouter/auto` | Automatically selects the best available model |
| `openrouter/anthropic/claude-3-haiku` | Fast, affordable Claude |
| `openrouter/anthropic/claude-3-sonnet` | Balanced Claude |
| `openrouter/meta-llama/llama-3-70b` | Meta's powerful Llama |
| `openrouter/google/gemini-pro` | Google's Gemini |

## Support

- GitHub: https://github.com/CloudCompile/vetraaiapi
- Report issues at: https://github.com/CloudCompile/vetraaiapi/issues