import { createClient } from '@/utils/supabase/client';

/**
 * Creates an authorized fetch wrapper that automatically attaches the
 * signed-in user's Supabase JWT to API requests made to your Express.js backend.
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const supabase = createClient();
  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;
  
  // 1. Get the current user session
  const { data: { session }, error } = await supabase.auth.getSession();

  // 2. Prepare headers
  const headers = new Headers(options.headers || {});
  
  // 3. Attach the JWT Token
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }

  // 4. Create the final config
  const config = {
    ...options,
    headers,
  };

  // 5. Fire away to the Express Backend
  return fetch(url, config);
}
