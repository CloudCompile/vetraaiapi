import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h1 className="text-5xl font-black tracking-tight mb-4">Elholk</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mb-8">
          A free, unified API gateway for LLMs. One endpoint. Swap models with a single parameter.
          Access Pollinations and AI Horde models through one authenticated route.
        </p>
        <div className="flex gap-4 mb-16">
          <Link href="/dashboard" className="px-5 py-3 rounded-lg bg-indigo-500 text-white font-bold hover:bg-indigo-600">
            Get API Key
          </Link>
          <Link href="/models" className="px-5 py-3 rounded-lg border border-zinc-800 text-zinc-100 font-bold hover:bg-zinc-900">
            Models
          </Link>
          <Link href="/docs" className="px-5 py-3 rounded-lg border border-zinc-800 text-zinc-100 font-bold hover:bg-zinc-900">
            Docs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Unified Endpoint', desc: 'One OpenAI-compatible API for all providers.' },
            { title: 'Free Access', desc: 'No billing. Tiers are granted on request.' },
            { title: 'Admin-reviewed Tiers', desc: 'Request upgrades; admins approve pending requests.' },
          ].map((f) => (
            <div key={f.title} className="border border-zinc-800 rounded-xl p-6 bg-zinc-900">
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
