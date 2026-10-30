import { currentUser } from '@clerk/nextjs/server';
import { syncUser } from '@/lib/admin-actions';

export async function SyncUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  const clerkUser = await currentUser();
  const isAuthenticated = !!clerkUser;
  const claims = clerkUser ? { sub: clerkUser.id, email: clerkUser.emailAddresses?.[0]?.emailAddress || '', username: clerkUser.username || '', name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' '), picture: clerkUser.imageUrl || '' } : null;

  if (isAuthenticated && claims && claims.sub) {
    // Logto claims usually have email if the 'email' scope is requested
    // If not, we might need to fetch it from the Management API or userinfo endpoint
    const email = (claims.email as string) || '';
    const username = (claims.username as string) || '';
    const name = (claims.name as string) || '';
    const avatar = (claims.picture as string) || '';
    
    if (email) {
      try {
        await syncUser(claims.sub, email, username, name, avatar);
      } catch (err) {
        console.error('Failed to sync user profile:', err);
      }
    }
  }

  return null;
}
