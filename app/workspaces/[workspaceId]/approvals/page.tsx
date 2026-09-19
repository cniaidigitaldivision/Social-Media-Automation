import React from 'react';
import { createClient } from '@/lib/supabase/server';
import ApprovalsClient from './ApprovalsClient';

export default async function ApprovalsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  const workspaceId = resolvedParams.workspaceId;
  const supabase = createClient();

  // Fetch ALL posts for this workspace for the approvals dashboard
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      id,
      status,
      scheduled_at,
      post_variants (
        id,
        platform,
        caption,
        media_urls,
        connected_accounts ( account_name )
      )
    `)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approvals:', error);
  }

  // Fetch workspace timezone
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('timezone')
    .eq('id', workspaceId)
    .single();

  const timezone = workspace?.timezone || 'UTC';

  return (
    <div className="page-content-wrapper">
      <ApprovalsClient 
        workspaceId={workspaceId} 
        initialPosts={posts || []} 
        timezone={timezone} 
      />
    </div>
  );
}
