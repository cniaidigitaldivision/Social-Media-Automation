'use server';

import { createClient } from '@/lib/supabase/server';
import { PostVariantSchema } from '@/lib/schemas/post';
import { z } from 'zod';

export type AccountTarget = {
  id: string;
  platform: 'facebook' | 'instagram';
  name: string;
};

export type SubmitPostPayload = {
  accounts: AccountTarget[];
  captions: Record<string, string>; // account.id -> caption text
  mediaUrls: string[];
  scheduledAt: string | null; // ISO string or null
};

export type SubmitPostResult = {
  success: boolean;
  postId?: string;
  status?: string;
  errors?: Record<string, string>;
  serverError?: string;
};

export async function submitPost(
  payload: SubmitPostPayload,
  workspaceId: string,
  isDraft: boolean,
  requiresApproval: boolean
): Promise<SubmitPostResult> {
  const supabase = createClient();

  if (!payload.accounts || payload.accounts.length === 0) {
    return { success: false, serverError: 'You must select at least one account.' };
  }

  // 1. Validate payloads per account
  const accountErrors: Record<string, string> = {};
  const validVariants: Array<{ accountId: string; platform: 'facebook' | 'instagram'; caption: string; media_urls: string[]; scheduled_at: string | null }> = [];

  for (const account of payload.accounts) {
    const variantData = {
      platform: account.platform,
      caption: payload.captions[account.id] || '',
      media_urls: payload.mediaUrls,
      // Only validate scheduled_at if we aren't saving a pure draft without a date
      scheduled_at: payload.scheduledAt || undefined,
    };

    const parsed = PostVariantSchema.safeParse(variantData);
    
    if (!parsed.success) {
      // Pick the first error for simplicity
      const firstError = parsed.error.issues[0];
      accountErrors[account.id] = firstError.message;
    } else {
      validVariants.push({
        accountId: account.id,
        platform: account.platform,
        caption: parsed.data.caption || '',
        media_urls: parsed.data.media_urls,
        scheduled_at: parsed.data.scheduled_at || null,
      });
    }
  }

  if (Object.keys(accountErrors).length > 0) {
    return { success: false, errors: accountErrors };
  }

  // 2. Determine post status
  let postStatus = 'draft';
  if (!isDraft) {
    postStatus = requiresApproval ? 'pending_approval' : 'scheduled';
  }

  // 3. Insert Parent Post
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .insert({
      workspace_id: workspaceId,
      status: postStatus,
      scheduled_at: payload.scheduledAt || null,
      created_by: null, // As specified, null since no client auth session yet
    })
    .select('id')
    .single();

  if (postError || !postData) {
    console.error('Failed to create parent post:', postError);
    return { success: false, serverError: 'Database error creating post. Please try again.' };
  }

  const postId = postData.id;

  // 4. Insert Variants (Simulating Rollback since Supabase REST API doesn't have native transactions)
  for (const variant of validVariants) {
    const { error: variantError } = await supabase
      .from('post_variants')
      .insert({
        post_id: postId,
        connected_account_id: variant.accountId,
        platform: variant.platform,
        caption: variant.caption,
        media_urls: variant.media_urls,
        scheduled_at: variant.scheduled_at,
        status: postStatus,
      });

    if (variantError) {
      // Rollback
      console.error(`Failed to create variant for account ${variant.accountId}:`, variantError);
      await supabase.from('posts').delete().eq('id', postId);
      return { 
        success: false, 
        serverError: `Failed to save post for ${variant.platform}. Your draft has been rolled back.` 
      };
    }
  }

  return { success: true, postId, status: postStatus };
}

export async function getUploadSignedUrl(
  workspaceId: string,
  fileName: string,
  contentType: string
) {
  const supabase = createClient();
  const tempId = crypto.randomUUID();
  const filePath = `${workspaceId}/${tempId}/${fileName}`;

  // Use createSignedUploadUrl for secure client-side PUT
  const { data, error } = await supabase.storage
    .from('post-media')
    .createSignedUploadUrl(filePath);

  if (error || !data) {
    console.error('Failed to create signed URL:', error);
    throw new Error('Failed to create upload URL');
  }

  // Also construct the final public URL
  const { data: publicData } = supabase.storage
    .from('post-media')
    .getPublicUrl(filePath);

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    publicUrl: publicData.publicUrl,
  };
}
