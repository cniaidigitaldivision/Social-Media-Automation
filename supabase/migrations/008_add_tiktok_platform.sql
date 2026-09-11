-- =============================================================================
-- Migration 008 - Add tiktok to connected_accounts and post_variants platform
--                 check constraints
-- =============================================================================

DO $$
DECLARE
  ca_constraint_name text;
  pv_constraint_name text;
BEGIN

  -- -- connected_accounts --
  SELECT conname INTO ca_constraint_name
  FROM pg_constraint c
  JOIN pg_namespace n  ON n.oid  = c.connamespace
  JOIN pg_class     cl ON cl.oid = c.conrelid
  JOIN pg_attribute a  ON a.attrelid = cl.oid AND a.attnum = ANY(c.conkey)
  WHERE cl.relname = 'connected_accounts'
    AND a.attname  = 'platform'
    AND c.contype  = 'c';

  IF ca_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE connected_accounts DROP CONSTRAINT ' || ca_constraint_name;
  END IF;

  ALTER TABLE connected_accounts
    ADD CONSTRAINT connected_accounts_platform_check
    CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'));

  -- -- post_variants --
  -- post_variants.platform has no CHECK constraint in the original migration
  -- (004_create_posts_tables.sql), but guard in case one was added later.
  SELECT conname INTO pv_constraint_name
  FROM pg_constraint c
  JOIN pg_namespace n  ON n.oid  = c.connamespace
  JOIN pg_class     cl ON cl.oid = c.conrelid
  JOIN pg_attribute a  ON a.attrelid = cl.oid AND a.attnum = ANY(c.conkey)
  WHERE cl.relname = 'post_variants'
    AND a.attname  = 'platform'
    AND c.contype  = 'c';

  IF pv_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE post_variants DROP CONSTRAINT ' || pv_constraint_name;
    ALTER TABLE post_variants
      ADD CONSTRAINT post_variants_platform_check
      CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'youtube', 'tiktok'));
  END IF;

END $$;
