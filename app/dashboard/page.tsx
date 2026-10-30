'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Copy, Trash2, Plus, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/keys');
      const d = await res.json();
      setKeys(d.keys || []);
    } catch {
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) fetchKeys();
    else setLoading(false);
  }, [isSignedIn]);

  const createKey = async () => {
    setCreating(true);
    try {
      await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'Unnamed Key' }),
      });
      setName('');
      await fetchKeys();
    } finally {
      setCreating(false);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm('Delete this key?')) return;
    await fetch('/api/keys', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchKeys();
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Sign in required</h1>
          <p className="text-zinc-400">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Manage API keys for {user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          <Link href="/profile" className="px-4 py-2 rounded-lg border border-zinc-800 text-sm font-bold hover:bg-zinc-900">
            Profile
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New key name"
            className="flex-1 px-4 py-2 rounded-lg bg-black border border-zinc-800 text-sm"
          />
          <button
            onClick={createKey}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Create Key
          </button>
        </div>

        {loading ? (
          <p className="text-zinc-500">Loading…</p>
        ) : keys.length === 0 ? (
          <p className="text-zinc-500">No API keys yet. Create one above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keys.map((k: any) => (
              <div key={k.id} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{k.name}</span>
                  <div className="flex gap-2">
                    <button onClick={() => copy(k.keyPreview, k.id)} className="p-1.5 rounded hover:bg-zinc-800">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteKey(k.id)} className="p-1.5 rounded hover:bg-zinc-800 text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 font-mono break-all mb-2">{k.keyPreview}</div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Activity className="h-3 w-3" />
                  {k.usageCount || 0} uses
                </div>
                {copiedId === k.id && <span className="text-xs text-emerald-400 mt-1 block">Copied (preview)</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
