-- =============================================================================
-- Migration 009 - Add nullable title column to post_variants
--                 Used for YouTube posts (title is a distinct required field).
--                 NULL for all other platforms.
-- =============================================================================
ALTER TABLE public.post_variants
  ADD COLUMN IF NOT EXISTS title text;
