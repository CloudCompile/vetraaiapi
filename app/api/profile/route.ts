import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ profile: null });
  }
  try {
    const clerkUser = await currentUser();
    const isAuthenticated = !!clerkUser;
    const claims = clerkUser ? { sub: clerkUser.id, email: clerkUser.emailAddresses?.[0]?.emailAddress, username: clerkUser.username, name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' '), picture: clerkUser.imageUrl } : null;
    
    if (!isAuthenticated || !claims) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('elholk_profiles')
      .select('role, plan')
      .eq('id', claims.sub)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Profile API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
