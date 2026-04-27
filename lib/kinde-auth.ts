import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from 'next/server';

const isKindeConfigured = () =>
  Boolean(process.env.KINDE_CLIENT_ID && process.env.KINDE_CLIENT_SECRET);

export async function getCurrentUserId(req?: NextRequest): Promise<string | null> {
  if (!isKindeConfigured()) return null;
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    if (!isAuth) return null;
    const user = await getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

export async function requireAuth(req?: NextRequest): Promise<string> {
  const userId = await getCurrentUserId(req);
  if (!userId) {
    throw new Error('Authentication required: No valid user session found');
  }
  return userId;
}

export async function getCurrentUser(req?: NextRequest) {
  if (!isKindeConfigured()) return null;
  try {
    const { isAuthenticated, getUser } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    if (!isAuth) return null;
    const user = await getUser();
    return user || null;
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (!isKindeConfigured()) return null;
  try {
    const { getAccessTokenRaw } = getKindeServerSession();
    const token = await getAccessTokenRaw();
    return token || null;
  } catch {
    return null;
  }
}

export async function isUserAuthenticated(): Promise<boolean> {
  if (!isKindeConfigured()) return false;
  try {
    const { isAuthenticated } = getKindeServerSession();
    const isAuth = await isAuthenticated();
    return Boolean(isAuth);
  } catch {
    return false;
  }
}