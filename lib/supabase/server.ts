/**
 * Server-only Supabase client — uses the service role key.
 *
 * The `server-only` import causes a hard build error if this module is ever
 * imported into a Client Component or any browser bundle, guaranteeing the
 * service role key never reaches the client.
 *
 * Use this ONLY in:
 *  - Next.js API routes (app/api/...)
 *  - Next.js Server Components
 *  - Server Actions
 */
import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      // Service role client bypasses RLS; disable session persistence
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
