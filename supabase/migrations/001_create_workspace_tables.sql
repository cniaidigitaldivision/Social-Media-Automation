-- =============================================================================
-- Migration 001 — Create workspace tables, RLS policies, triggers, indexes,
--                 and Supabase Storage bucket for workspace logos
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

create table if not exists public.workspaces (
  id              uuid        primary key default gen_random_uuid(),
  name            text        not null,
  slug            text        unique not null,
  logo_url        text,
  logo_path       text,
  brand_color     text        default '#0F5132',
  industry        text,
  country_code    text        default 'PK',
  timezone        text        default 'Asia/Karachi',
  owner_id        uuid        references auth.users,
  requires_approval boolean   default true,
  status          text        default 'active'
                  check (status in ('active', 'paused', 'archived')),
  website_url     text,
  drive_folder_id text,
  default_language text       default 'en',
  created_by      uuid        references auth.users,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists public.brand_kits (
  id                uuid        primary key default gen_random_uuid(),
  workspace_id      uuid        unique references public.workspaces on delete cascade,
  brand_voice       text,
  tone_preset       text,
  target_audience   text,
  do_rules          text[],
  dont_rules        text[],
  banned_words      text[],
  cta_library       text[],
  default_hashtags  text[],
  secondary_color   text,
  font_primary      text,
  font_secondary    text,
  compliance_notes  text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create table if not exists public.workspace_members (
  id            uuid  primary key default gen_random_uuid(),
  workspace_id  uuid  references public.workspaces on delete cascade,
  user_id       uuid  references auth.users,
  role          text  check (role in ('admin', 'strategist', 'designer', 'viewer')),
  unique (workspace_id, user_id)
);

-- ---------------------------------------------------------------------------
-- 2. INDEXES
-- ---------------------------------------------------------------------------

create index if not exists idx_workspaces_slug   on public.workspaces (slug);
create index if not exists idx_workspaces_status on public.workspaces (status);

-- ---------------------------------------------------------------------------
-- 3. UPDATED_AT TRIGGER
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- workspaces
drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

-- brand_kits
drop trigger if exists trg_brand_kits_updated_at on public.brand_kits;
create trigger trg_brand_kits_updated_at
  before update on public.brand_kits
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. ROW-LEVEL SECURITY
-- ---------------------------------------------------------------------------

alter table public.workspaces        enable row level security;
alter table public.brand_kits        enable row level security;
alter table public.workspace_members enable row level security;

-- ---- workspaces policies ----

-- Any authenticated user can read workspaces
create policy "workspaces: authenticated read"
  on public.workspaces
  for select
  to authenticated
  using (true);

-- Only workspace admins can insert
create policy "workspaces: admin insert"
  on public.workspaces
  for insert
  to authenticated
  with check (
    auth.uid() = created_by
  );

-- Only workspace admins can update
create policy "workspaces: admin update"
  on public.workspaces
  for update
  to authenticated
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- ---- brand_kits policies ----

create policy "brand_kits: authenticated read"
  on public.brand_kits
  for select
  to authenticated
  using (true);

create policy "brand_kits: admin insert"
  on public.brand_kits
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

create policy "brand_kits: admin update"
  on public.brand_kits
  for update
  to authenticated
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- ---- workspace_members policies ----

create policy "workspace_members: authenticated read"
  on public.workspace_members
  for select
  to authenticated
  using (true);

create policy "workspace_members: admin insert"
  on public.workspace_members
  for insert
  to authenticated
  with check (
    -- Allow self-insert when creating a new workspace (creator becomes admin)
    user_id = auth.uid()
    or
    -- Or when an existing admin adds someone
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

create policy "workspace_members: admin update"
  on public.workspace_members
  for update
  to authenticated
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspace_id
        and wm.user_id = auth.uid()
        and wm.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- 5. STORAGE — workspace-logos bucket
-- ---------------------------------------------------------------------------

-- Create the bucket (idempotent via upsert pattern)
insert into storage.buckets (id, name, public)
values ('workspace-logos', 'workspace-logos', true)
on conflict (id) do update
  set public = true;

-- Public read: anyone can read logo files
create policy "workspace-logos: public read"
  on storage.objects
  for select
  using (bucket_id = 'workspace-logos');

-- Authenticated write: any logged-in user can upload
create policy "workspace-logos: authenticated upload"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'workspace-logos');

-- Authenticated delete: any logged-in user can delete (cleanup on failure)
create policy "workspace-logos: authenticated delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'workspace-logos');
