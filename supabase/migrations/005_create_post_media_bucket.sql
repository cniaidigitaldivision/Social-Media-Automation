-- =============================================================================
-- Migration 005 — Create post-media Storage bucket for uploaded post media
--
-- Apply in Supabase SQL Editor (same as migrations 001-004).
-- =============================================================================

-- Create the bucket (idempotent via ON CONFLICT DO UPDATE, mirrors workspace-logos in 001)
insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do update
  set public = true;

-- Public read: anyone can read media files (required for Instagram's fetch-based publishing)
create policy "post-media: public read"
  on storage.objects
  for select
  using (bucket_id = 'post-media');

-- Authenticated write: any logged-in user can upload post media
create policy "post-media: authenticated upload"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'post-media');

-- Authenticated delete: any logged-in user can delete (cleanup on failed submissions)
create policy "post-media: authenticated delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'post-media');
