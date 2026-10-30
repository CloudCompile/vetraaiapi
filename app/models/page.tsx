'use client';

import { useEffect, useState } from 'react';

interface Model { id: string; name: string; provider: string; type: string; }

function cleanName(id: string): string {
  let name = id.startsWith('polli/') || id.startsWith('horde/') ? id.slice(id.indexOf('/') + 1) : id;
  name = name.split('/').pop() || name;
  name = name.replace(/:free$/i, '').replace(/-free$/i, '');
  return name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/v1/models')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const mapped = (d?.data || []).map((m: any) => ({
          id: m.id,
          name: cleanName(m.id),
          provider: m.owned_by || 'unknown',
          type: m.type || 'chat',
        }));
        setModels(mapped);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = models.filter((m) => m.id.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase()) || m.provider.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-zinc-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Models</h1>
        <p className="text-zinc-400 mb-10">Available chat models from Pollinations and AI Horde.</p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search models…"
          className="w-full mb-6 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm"
        />
        {loading ? (
          <p className="text-zinc-500">Loading…</p>
        ) : models.length === 0 ? (
          <p className="text-zinc-500">No models found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <div key={m.id} className="border border-zinc-800 rounded-xl p-5 bg-zinc-900 hover:border-zinc-700 transition">
                <div className="text-zinc-500 text-xs uppercase tracking-widest mb-2">{m.provider}</div>
                <div className="text-lg font-semibold mb-3">{m.name}</div>
                <code className="text-xs text-zinc-400 break-all">{m.id}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
