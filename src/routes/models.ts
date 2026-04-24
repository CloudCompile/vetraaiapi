import { Router, Request, Response } from 'express';

const router = Router();
const OPENROUTER_MODELS_URL = 'https://openrouter.ai/api/v1/models';

router.get('/', async (_req: Request, res: Response) => {
  try {
    const orRes = await fetch(OPENROUTER_MODELS_URL, {
      headers: {
        'HTTP-Referer': 'https://vetra.ai',
        'X-Title': 'Vetra API',
      },
    });

    if (!orRes.ok) {
      const err = await orRes.text();
      res.status(orRes.status).json({ error: 'OpenRouter error', detail: err });
      return;
    }

    const data = await orRes.json();
    res.json(data);
  } catch (err) {
    console.error('Models error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as modelsRouter };
