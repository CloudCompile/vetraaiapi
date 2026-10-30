'use client';

import { Check, Zap, Shield, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For exploration and personal projects.',
    features: [
      'Access to standard chat models',
      '60 requests per minute',
      '1,000 requests per day',
      'Community support',
    ],
    buttonText: 'Get Started',
    buttonHref: '/dashboard',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$0',
    description: 'For professional developers and growing applications.',
    features: [
      'Access to ALL flagship models',
      'GPT-4o, Claude Sonnet 4, Gemini 2.5 Pro',
      'Reasoning & specialized models',
      '500 requests per minute',
      'Priority support',
    ],
    buttonText: 'Request Access',
    buttonHref: '/profile',
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Pricing</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Elholk is completely free. Tiers only affect rate limits and model access,
          and are granted on request after admin review.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'p-6 rounded-2xl border bg-white dark:bg-slate-900 flex flex-col',
              plan.highlight ? 'border-primary shadow-lg' : 'border-slate-200 dark:border-slate-800'
            )}
          >
            <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
            <p className="text-3xl font-black mb-2">{plan.price}</p>
            <p className="text-sm text-slate-500 mb-6">{plan.description}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href={plan.buttonHref}
              className={cn(
                'w-full text-center py-2 rounded-lg font-bold text-sm',
                plan.highlight
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {plan.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
