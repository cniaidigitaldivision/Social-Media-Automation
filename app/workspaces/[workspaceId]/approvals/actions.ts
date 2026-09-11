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
