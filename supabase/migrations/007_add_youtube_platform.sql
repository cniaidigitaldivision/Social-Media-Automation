-- =============================================================================
-- Migration 007 - Add youtube to connected_accounts platform enum/check
-- =============================================================================

DO $$ 
DECLARE
  ca_constraint_name text;
BEGIN
  -- Find the check constraint on connected_accounts.platform
  SELECT conname INTO ca_constraint_name
  FROM pg_constraint c
  JOIN pg_namespace n ON n.oid = c.connamespace
  JOIN pg_class cl ON cl.oid = c.conrelid
  JOIN pg_attribute a ON a.attrelid = cl.oid AND a.attnum = ANY(c.conkey)
  WHERE cl.relname = 'connected_accounts'
    AND a.attname = 'platform'
    AND c.contype = 'c';

  IF ca_constraint_name IS NOT NULL THEN
    EXECUTE 'ALTER TABLE connected_accounts DROP CONSTRAINT ' || ca_constraint_name;
  END IF;

  -- Add the new check constraint with youtube included
  ALTER TABLE connected_accounts 
    ADD CONSTRAINT connected_accounts_platform_check 
    CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'youtube'));

END $$;
