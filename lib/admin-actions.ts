'use server';

import { currentUser } from '@clerk/nextjs/server';

import { supabaseAdmin } from './supabase';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
    const clerkUser = await currentUser();
    const isAuthenticated = !!clerkUser;
    const claims = clerkUser ? { sub: clerkUser.id, email: clerkUser.emailAddresses?.[0]?.emailAddress, username: clerkUser.username, name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' '), picture: clerkUser.imageUrl } : null;

  if (!isAuthenticated || !claims) {
    throw new Error('Unauthorized: Admin access required');
  }

  const { data: profile, error } = await supabaseAdmin
    .from('elholk_profiles')
    .select('role')
    .eq('id', claims.sub)
    .maybeSingle();

  if (error || !profile || profile.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  return claims;
}

export async function getAllUsers() {
  await verifyAdmin();

  const { data, error } = await supabaseAdmin
    .from('elholk_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
}

export async function promoteUser(userId: string, role: 'user' | 'admin') {
  await verifyAdmin();

  const { error } = await supabaseAdmin
    .from('elholk_profiles')
    .update({ role })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to promote user: ${error.message}`);
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function assignPlan(userId: string, plan: 'free' | 'developer' | 'pro' | 'enterprise', stripeProductId?: string) {
  await verifyAdmin();

  const { error } = await supabaseAdmin
    .from('elholk_profiles')
    .update({ 
      plan, 
      stripe_product_id: stripeProductId || null 
    })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to assign plan: ${error.message}`);
  }

  // Also update rate limits for their API keys if they upgrade
  if (plan === 'pro' || plan === 'enterprise' || plan === 'developer') {
    let rateLimit = 100; // Developer default
    if (plan === 'pro') rateLimit = 500;
    if (plan === 'enterprise') rateLimit = 1000;

    const { error: keyError } = await supabaseAdmin
      .from('elholk_api_keys')
      .update({ rate_limit: rateLimit })
      .eq('user_id', userId);
      
    if (keyError) {
      console.error('Failed to update API key rate limits:', keyError);
    }
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function syncUser(userId: string, email: string, username?: string, name?: string, avatar?: string) {
  const { data: existing } = await supabaseAdmin
    .from('elholk_profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from('elholk_profiles')
      .update({
        email,
        username: username || undefined,
        name: name || undefined,
        avatar: avatar || undefined,
      })
      .eq('id', userId);
    return;
  }

  const { error } = await supabaseAdmin
    .from('elholk_profiles')
    .insert({
      id: userId,
      email,
      username: username || undefined,
      name: name || undefined,
      avatar: avatar || undefined,
      role: 'user',
      plan: 'free',
    });

  if (error && error.code !== '23505') {
    console.error('Error syncing user profile:', JSON.stringify(error));
    return;
  }
}
