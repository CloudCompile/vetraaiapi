import { NextResponse, NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

async function isAdmin(userId: string) {
  const { data } = await supabaseAdmin
    .from('elholk_profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  return data?.role === 'admin';
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!(await isAdmin(user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const status = body.status === 'approved' ? 'approved' : 'rejected';

  const { data: req, error } = await supabaseAdmin
    .from('elholk_tier_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === 'approved') {
    await supabaseAdmin
      .from('elholk_profiles')
      .update({ plan: req.requested_plan })
      .eq('id', req.user_id);
  }

  return NextResponse.json({ request: req });
}
