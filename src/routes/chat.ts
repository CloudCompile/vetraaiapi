import { Router, Request, Response } from 'express';

const router = Router();
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as ChatCompletionRequest;

    if (!body.model) {
      res.status(400).json({ error: 'Missing required field: model' });
      return;
    }
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      res.status(400).json({ error: 'Missing required field: messages' });
      return;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://vetra.ai',
      'X-Title': 'Vetra API',
    };

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey) {
      headers['Authorization'] = `Bearer ${openRouterKey}`;
    }

    const payload = {
      model: body.model,
      messages: body.messages,
      stream: body.stream ?? false,
      temperature: body.temperature ?? 0.7,
      max_tokens: body.max_tokens ?? 1024,
      top_p: body.top_p ?? 1,
      presence_penalty: body.presence_penalty ?? 0,
      frequency_penalty: body.frequency_penalty ?? 0,
    };

    const orRes = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!orRes.ok) {
      const err = await orRes.text();
      res.status(orRes.status).json({ error: 'OpenRouter error', detail: err });
      return;
    }

    if (body.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = orRes.body?.getReader();
      if (!reader) {
        res.status(500).json({ error: 'Failed to read stream' });
        return;
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      }

      res.end();
      return;
    }

    const data = await orRes.json();
    res.json(data);
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as chatRouter };
