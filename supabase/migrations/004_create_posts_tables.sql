CREATE TABLE IF NOT EXISTS public.posts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  status text default 'draft' check (status in ('draft','pending_approval','scheduled','publishing','published','failed','cancelled')),
  scheduled_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.post_variants (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  connected_account_id uuid references public.connected_accounts(id) on delete cascade,
  platform text not null,
  caption text,
  media_urls text[],
  status text default 'pending' check (status in ('pending','publishing','published','failed')),
  platform_post_id text,
  live_url text,
  error text,
  published_at timestamptz,
  attempts int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(post_id, connected_account_id)
);

-- RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON public.posts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON public.posts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON public.posts FOR DELETE TO authenticated USING (true);

CREATE POLICY "Enable read access for authenticated users" ON public.post_variants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON public.post_variants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users" ON public.post_variants FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users" ON public.post_variants FOR DELETE TO authenticated USING (true);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_modtime
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_post_variants_modtime
BEFORE UPDATE ON public.post_variants
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_workspace_status_sched ON public.posts(workspace_id, status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_post_variants_post_id ON public.post_variants(post_id);
CREATE INDEX IF NOT EXISTS idx_post_variants_status ON public.post_variants(status);
