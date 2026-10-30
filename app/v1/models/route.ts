import { NextResponse } from 'next/server';
import { IMAGE_MODELS, VIDEO_MODELS } from '@/lib/providers';
import { getCorsHeaders } from '@/lib/utils';

export const runtime = 'edge';

async function getStableHordeModels() {
  try {
    const res = await fetch('https://oai.aihorde.net/v1/models', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.map((m: any) => ({
      id: 'horde/' + m.id,
      object: 'model',
      created: 1677610602,
      owned_by: 'stablehorde',
      type: 'chat'
    }));
  } catch { return []; }
}

async function getPollinationsFreeModels() {
  try {
    const res = await fetch('https://gen.pollinations.ai/v1/models', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data?.data) ? data.data : [];
    return list
      .filter((m: any) => {
        const id = typeof m?.id === 'string' ? m.id : '';
        if (!(id.includes(':free') || id.includes('-free'))) return false;
        const low = id.toLowerCase();
        if (low.includes('flux') || low.includes('image') || low.includes('diffusion') || low.includes('sdxl') || low.includes('sd-')) return false;
        return true;
      })
      .map((m: any) => ({
        id: 'polli/' + m.id,
        object: 'model',
        created: 1677610602,
        owned_by: 'pollinations',
        type: 'chat'
      }));
  } catch {
    return [];
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(),
  });
}

export async function GET() {
  const pollinationsFree = await getPollinationsFreeModels();

  const stableHorde = await getStableHordeModels();

  const allModels = [
    ...pollinationsFree,
    ...stableHorde,
    ...IMAGE_MODELS.map(m => ({
      id: m.id,
      object: 'model',
      created: 1677610602,
      owned_by: m.provider,
      type: 'image'
    })),
    ...VIDEO_MODELS.map(m => ({
      id: m.id,
      object: 'model',
      created: 1677610602,
      owned_by: m.provider,
      type: 'video'
    }))
  ];

  return NextResponse.json({
    object: 'list',
    data: allModels
  }, {
    headers: getCorsHeaders()
  });
}
