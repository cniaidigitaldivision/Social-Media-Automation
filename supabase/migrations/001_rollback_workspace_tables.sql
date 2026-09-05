-- =============================================================================
-- Rollback 001 — Drop workspace tables, RLS policies, triggers, indexes,
--                and Storage bucket in reverse dependency order
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. STORAGE — drop bucket policies and bucket
-- ---------------------------------------------------------------------------

drop policy if exists "workspace-logos: authenticated delete" on storage.objects;
drop policy if exists "workspace-logos: authenticated upload" on storage.objects;
drop policy if exists "workspace-logos: public read"          on storage.objects;

-- NOTE: Deletes all objects in the bucket first, then removes the bucket.
-- In production, run this only after confirming all objects are safe to delete.
delete from storage.objects where bucket_id = 'workspace-logos';
delete from storage.buckets  where id = 'workspace-logos';

-- ---------------------------------------------------------------------------
-- 2. RLS POLICIES
-- ---------------------------------------------------------------------------

-- workspace_members
drop policy if exists "workspace_members: admin update"      on public.workspace_members;
drop policy if exists "workspace_members: admin insert"      on public.workspace_members;
drop policy if exists "workspace_members: authenticated read" on public.workspace_members;

-- brand_kits
drop policy if exists "brand_kits: admin update"             on public.brand_kits;
drop policy if exists "brand_kits: admin insert"             on public.brand_kits;
drop policy if exists "brand_kits: authenticated read"       on public.brand_kits;

-- workspaces
drop policy if exists "workspaces: admin update"             on public.workspaces;
drop policy if exists "workspaces: admin insert"             on public.workspaces;
drop policy if exists "workspaces: authenticated read"       on public.workspaces;

-- ---------------------------------------------------------------------------
-- 3. TRIGGERS
-- ---------------------------------------------------------------------------

drop trigger if exists trg_brand_kits_updated_at  on public.brand_kits;
drop trigger if exists trg_workspaces_updated_at  on public.workspaces;
drop function if exists public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. INDEXES
-- ---------------------------------------------------------------------------

drop index if exists public.idx_workspaces_status;
drop index if exists public.idx_workspaces_slug;

-- ---------------------------------------------------------------------------
-- 5. TABLES (reverse FK order)
-- ---------------------------------------------------------------------------

drop table if exists public.workspace_members;
drop table if exists public.brand_kits;
drop table if exists public.workspaces;
