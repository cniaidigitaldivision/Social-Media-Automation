/**
 * URL-safe slug utilities.
 * Used by both the API route and client-side slug preview.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Convert an arbitrary string to a URL-safe slug.
 * e.g. "Acme Corp (PK)" → "acme-corp-pk"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // non-alphanumeric → dash
    .replace(/^-+|-+$/g, '')     // trim leading/trailing dashes
    .replace(/-{2,}/g, '-');     // collapse double-dashes
}

/**
 * Check the DB for slug collisions and append -2, -3, … until unique.
 * @param supabase — server-side Supabase client
 * @param base — the initial slug to try
 */
export async function ensureUniqueSlug(
  supabase: SupabaseClient,
  base: string
): Promise<string> {
  let candidate = base;
  let attempt = 1;

  while (true) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id')
      .eq('slug', candidate)
      .maybeSingle();

    if (error) throw new Error(`Slug uniqueness check failed: ${error.message}`);
    if (!data) return candidate; // slug is available

    attempt++;
    candidate = `${base}-${attempt}`;
  }
}
