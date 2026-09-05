create table connected_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces on delete cascade,
  platform text check (platform in ('facebook','instagram')),
  platform_account_id text not null,
  account_name text,
  account_avatar_url text,
  status text default 'active'
    check (status in ('active','needs_reconnect','revoked')),
  connected_by uuid references auth.users,
  connected_at timestamptz default now(),
  last_verified_at timestamptz,
  unique(workspace_id, platform, platform_account_id)
);

create table token_vault (
  id uuid primary key default gen_random_uuid(),
  account_id uuid unique references connected_accounts on delete cascade,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  expires_at timestamptz,
  scopes text[],
  updated_at timestamptz default now()
);

alter table connected_accounts enable row level security;
create policy "connected_accounts_read_authenticated"
  on connected_accounts for select
  to authenticated
  using (true);

alter table token_vault enable row level security;
-- service_role bypasses RLS by default. Not creating any policies for anon/authenticated
-- implicitly denies them all access.
