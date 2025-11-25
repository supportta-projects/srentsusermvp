import { supabase } from './supabaseClient';
import { redirect } from 'next/navigation';

/**
 * Get the current user session on the server side
 * Use this in server components or API routes
 */
export async function getServerSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return session;
}

/**
 * Get the current user on the server side
 * Use this in server components or API routes
 */
export async function getServerUser() {
  const session = await getServerSession();
  return session?.user || null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components
 */
export async function requireAuth(redirectTo?: string) {
  const session = await getServerSession();
  
  if (!session) {
    const loginUrl = redirectTo 
      ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/login';
    redirect(loginUrl);
  }
  
  return session;
}

/**
 * Get redirect URL from search params
 * Useful for preserving user intent after login
 */
export function getRedirectUrl(searchParams: URLSearchParams | null): string {
  if (!searchParams) return '/';
  
  const redirectTo = searchParams.get('redirectTo');
  return redirectTo || '/';
}

