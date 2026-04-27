/**
 * Vetra API Server - Models Route
 * OpenAI-compatible /v1/models endpoint
 */

import { Router } from 'express';
import { CHAT_MODELS } from '../models';

const router = Router();

function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

router.options('/', (_req, res) => {
  res.set(getCorsHeaders());
  res.status(204).send();
});

router.get('/', (_req, res) => {
  const models = CHAT_MODELS.map(m => ({
    id: m.id,
    object: 'model' as const,
    created: 1677610602,
    owned_by: m.provider,
  }));

  res.set(getCorsHeaders());
  res.json({
    object: 'list',
    data: models,
  });
});

export default router;
