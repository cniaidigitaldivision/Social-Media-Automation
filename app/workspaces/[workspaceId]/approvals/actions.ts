'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approvePost(postId: string, workspaceId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('posts')
    .update({ status: 'scheduled' })
    .eq('id', postId)
    .eq('status', 'pending_approval');
    
  if (error) {
    throw new Error('Failed to approve post');
  }
  
  revalidatePath(`/workspaces/${workspaceId}/approvals`);
  revalidatePath(`/workspaces/${workspaceId}`, 'layout');
}

export async function rejectPost(postId: string, workspaceId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('posts')
    .update({ status: 'cancelled' })
    .eq('id', postId)
    .eq('status', 'pending_approval');
    
  if (error) {
    throw new Error('Failed to reject post');
  }
  
  revalidatePath(`/workspaces/${workspaceId}/approvals`);
  revalidatePath(`/workspaces/${workspaceId}`, 'layout');
}

export async function updatePost(variantId: string, postId: string, caption: string, scheduledAt: string, workspaceId: string) {
  const supabase = createClient();
  
  // Update caption on variant
  const { error: variantError } = await supabase
    .from('post_variants')
    .update({ caption })
    .eq('id', variantId);
    
  if (variantError) throw new Error('Failed to update variant caption');
  
  // Update scheduled_at on parent post
  const { error: postError } = await supabase
    .from('posts')
    .update({ scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null })
    .eq('id', postId);
    
  if (postError) throw new Error('Failed to update post schedule');
  
  revalidatePath(`/workspaces/${workspaceId}/approvals`);
  revalidatePath(`/workspaces/${workspaceId}`, 'layout');
}
