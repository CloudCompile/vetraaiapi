'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function PendingTierRequests({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial);

  const act = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch(`/api/tier-requests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setItems((prev) => prev.map((r) => (r.id === id ? data.request : r)));
  };

  const pending = items.filter((r) => r.status === 'pending');
  if (pending.length === 0) return <p className="text-sm text-slate-500">No pending tier requests.</p>;

  return (
    <ul className="space-y-3">
      {pending.map((r) => (
        <li key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div>
            <p className="font-bold text-sm">{r.user_id}</p>
            <p className="text-xs text-slate-500">Requested: {r.requested_plan} — {r.notes || 'No notes'}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => act(r.id, 'approved')} className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
              <Check className="h-4 w-4" />
            </button>
            <button onClick={() => act(r.id, 'rejected')} className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
