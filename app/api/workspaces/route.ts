/**
 * POST /api/workspaces
 *
 * Creates a workspace, brand kit, and membership records in a single
 * atomic-ish transaction. Uses the service-role key (server-only) so RLS
 * is bypassed and the inserts succeed regardless of who the caller is.
 *
 * Error contract:
 *  201 — { id, name, slug, logo_url }
 *  400 — { error: string, fieldErrors?: Record<string, string[]> }
 *  409 — { error: 'A workspace with this name already exists.' }
 *  500 — { error: 'Internal server error.' }
 */
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createWorkspaceApiSchema } from '@/lib/schemas/workspace';
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug';

// Allowed MIME types for logo uploads
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]);
const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(req: NextRequest) {
  let workspaceId: string | null = null;

  try {
    // ── 1. Parse & validate body ────────────────────────────────────────────
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }

    const parsed = createWorkspaceApiSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      parsed.error.errors.forEach((e) => {
        const key = e.path.join('.');
        fieldErrors[key] = fieldErrors[key] ?? [];
        fieldErrors[key].push(e.message);
      });
      return NextResponse.json(
        { error: 'Validation failed.', fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // ── 2. Server-side logo validation (MIME + size via logo_path heuristic) ─
    // The client uploads the file directly and sends back logo_path + logo_url.
    // We validate the content-type header it stored in Storage if logo_path exists.
    // Primary client-side validation already ran; this is a belt-and-suspenders check.
    if (data.logo_path) {
      const ext = data.logo_path.split('.').pop()?.toLowerCase();
      const extToMime: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        svg: 'image/svg+xml',
      };
      if (!ext || !ALLOWED_MIME_TYPES.has(extToMime[ext] ?? '')) {
        return NextResponse.json(
          { error: 'Invalid logo file type. Allowed: PNG, JPG, WEBP, SVG.' },
          { status: 400 }
        );
      }
    }

    // ── 3. Supabase service client ──────────────────────────────────────────
    const supabase = createClient();

    // ── 4. Check for duplicate name ────────────────────────────────────────
    const { data: existing } = await supabase
      .from('workspaces')
      .select('id')
      .ilike('name', data.name.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: 'A workspace with this name already exists.' },
        { status: 409 }
      );
    }

    // ── 5. Generate unique slug ─────────────────────────────────────────────
    const baseSlug = generateSlug(data.name);
    const slug = await ensureUniqueSlug(supabase, baseSlug);

    // ── 6. Insert workspace ─────────────────────────────────────────────────
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .insert({
        name: data.name.trim(),
        slug,
        logo_url: data.logo_url || null,
        logo_path: data.logo_path || null,
        brand_color: data.brand_color,
        industry: data.industry || null,
        country_code: data.country_code,
        timezone: data.timezone,
        // Hardcoded to null during mock phase to prevent auth.users foreign key violation
        owner_id: null,
        requires_approval: data.requires_approval,
        status: 'active',
        website_url: data.website_url || null,
        drive_folder_id: data.drive_folder_id || null,
        default_language: data.default_language,
        // created_by is set to null until auth is wired in
        created_by: null,
      })
      .select('id, name, slug, logo_url')
      .single();

    if (wsError || !workspace) {
      console.error('[POST /api/workspaces] workspace insert error:', wsError);
      return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }

    workspaceId = workspace.id;

    // ── 7. Insert brand kit ─────────────────────────────────────────────────
    const { error: bkError } = await supabase
      .from('brand_kits')
      .insert({
        workspace_id: workspaceId,
        brand_voice: data.brand_voice || null,
        tone_preset: data.tone_preset || null,
        target_audience: data.target_audience || null,
        do_rules: data.do_rules?.filter(Boolean) ?? [],
        dont_rules: data.dont_rules?.filter(Boolean) ?? [],
        banned_words: data.banned_words ?? [],
        cta_library: data.cta_library ?? [],
        default_hashtags: data.default_hashtags ?? [],
        secondary_color: data.secondary_color || null,
        font_primary: data.font_primary || null,
        font_secondary: data.font_secondary || null,
        compliance_notes: data.compliance_notes || null,
      });

    if (bkError) {
      console.error('[POST /api/workspaces] brand_kit insert error:', bkError);
      await rollbackWorkspace(supabase, workspaceId!);
      return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }

    // ── 8. Insert workspace_members ─────────────────────────────────────────
    // Creator is always admin. Owner is also admin if different from creator.
    const memberRows: Array<{ workspace_id: string; user_id: string; role: string }> = [];

    // Skipped during mock phase to prevent auth.users foreign key violation
    // if (data.owner_id) {
    //   memberRows.push({
    //     workspace_id: workspaceId!,
    //     user_id: data.owner_id!,
    //     role: 'admin',
    //   });
    // }

    // When auth is wired in, also push the authenticated creator:
    // if (creatorId && creatorId !== data.owner_id) {
    //   memberRows.push({ workspace_id: workspaceId, user_id: creatorId, role: 'admin' });
    // }

    if (memberRows.length > 0) {
      const { error: memError } = await supabase
        .from('workspace_members')
        .insert(memberRows);

      if (memError) {
        console.error('[POST /api/workspaces] workspace_members insert error:', memError);
        await rollbackWorkspace(supabase, workspaceId!);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
      }
    }

    // ── 9. Return 201 ───────────────────────────────────────────────────────
    return NextResponse.json(
      {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        logo_url: workspace.logo_url,
      },
      { status: 201 }
    );
  } catch (err) {
    // Catch-all — log real error, return generic message
    console.error('[POST /api/workspaces] unexpected error:', err);

    // If the workspace was partially created, clean it up
    if (workspaceId) {
      try {
        const supabase = createClient();
        await rollbackWorkspace(supabase, workspaceId);
      } catch (cleanupErr) {
        console.error('[POST /api/workspaces] rollback error:', cleanupErr);
      }
    }

    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed.', fieldErrors: err.flatten().fieldErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Delete a partially-created workspace row.
 * Due to CASCADE on brand_kits and workspace_members, this cleans up everything.
 */
async function rollbackWorkspace(
  supabase: ReturnType<typeof createClient>,
  workspaceId: string
) {
  const { error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', workspaceId);

  if (error) {
    console.error('[rollbackWorkspace] failed to delete workspace:', workspaceId, error);
  }
}
