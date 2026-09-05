import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ComposerClient } from './ComposerClient';

export default async function ComposerPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  const workspaceId = resolvedParams.workspaceId;

  const supabase = createClient();

  // 1. Fetch workspace details
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('id, name, slug, timezone, requires_approval')
    .eq('id', workspaceId)
    .single();

  if (workspaceError || !workspace) {
    notFound();
  }

  // 2. Fetch connected accounts
  const { data: accounts } = await supabase
    .from('connected_accounts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('platform', { ascending: true });

  // 3. Fetch brand kit
  const { data: brandKit } = await supabase
    .from('brand_kits')
    .select('banned_words, default_hashtags, cta_library')
    .eq('workspace_id', workspaceId)
    .single();

  return (
    <ComposerClient 
      workspace={workspace} 
      accounts={accounts || []} 
      brandKit={brandKit || {}} 
    />
  );
}
