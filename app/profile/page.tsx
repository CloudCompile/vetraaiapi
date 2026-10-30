'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { UserProfile } from '@clerk/nextjs';
import { Crown, Shield, Zap, Send, CheckCircle2, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState<{ role: string; plan: string } | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [plan, setPlan] = useState('pro');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/profile')
      .then((r) => r.json())
      .then((d) => { if (d.profile) setProfile(d.profile); })
      .catch(() => {});
    fetch('/api/tier-requests')
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .catch(() => {});
  }, [isSignedIn]);

  const submitRequest = async () => {
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/tier-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedPlan: plan, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setRequests((prev) => [data.request, ...prev]);
      setNotes('');
      setMessage('Request submitted. An admin will review it.');
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign in required</h1>
        <p className="text-slate-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Profile & Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <div className="flex items-center gap-4 mb-4">
            {user?.imageUrl && (
              <img src={user.imageUrl} alt="avatar" className="h-16 w-16 rounded-full" />
            )}
            <div>
              <p className="font-bold text-lg">{user?.fullName || user?.username}</p>
              <p className="text-sm text-slate-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Role: {profile?.role || 'user'}</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Plan: {profile?.plan || 'free'}</span>
          </div>
          <button
            onClick={() => signOut(() => (window.location.href = '/'))}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> Request Tier Upgrade
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Tiers are free on request. An admin reviews and approves pending requests.
          </p>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800"
          >
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Why do you need this tier? (optional)"
            className="w-full mb-3 px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-800 min-h-[80px]"
          />
          <button
            onClick={submitRequest}
            disabled={submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Submit Request
          </button>
          {message && <p className="text-sm mt-3 text-slate-600">{message}</p>}
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-8">
        <h2 className="text-xl font-bold mb-4">My Tier Requests</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-slate-500">No requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="font-bold text-sm">{r.requested_plan}</p>
                  <p className="text-xs text-slate-500">{r.notes || 'No notes'}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  {r.status === 'approved' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : r.status === 'pending' ? (
                    <Clock className="h-4 w-4 text-amber-500" />
                  ) : (
                    <span className="text-red-500">Rejected</span>
                  )}
                  {r.status}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-bold mb-4">Account Management</h2>
        <UserProfile />
      </div>
    </div>
  );
}
