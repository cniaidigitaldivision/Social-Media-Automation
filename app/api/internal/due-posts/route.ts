import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { getDecryptedToken } from '@/lib/token-vault';

export async function GET(request: Request) {
  const secret = request.headers.get('x-internal-secret');
  const expectedSecret = process.env.INTERNAL_API_SECRET;

  if (!secret || !expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (secretBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(secretBuffer, expectedBuffer)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();
  const now = new Date();

  // 1. Stale-claim safety net: reset variants stuck in 'publishing' for > 10 minutes
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
  await supabase
    .from('post_variants')
    .update({ status: 'pending' })
    .eq('status', 'publishing')
    .lt('updated_at', tenMinutesAgo);

  // 2. Find due posts
  const { data: dueVariants, error: fetchError } = await supabase
    .from('post_variants')
    .select(`
      id,
      post_id,
      connected_account_id,
      platform,
      caption,
      media_urls,
      title,
      posts!inner(status, scheduled_at),
      connected_accounts!inner(platform_account_id)
    `)
    .eq('status', 'pending')
    .eq('posts.status', 'scheduled')
    .lte('posts.scheduled_at', now.toISOString());

  if (fetchError || !dueVariants || dueVariants.length === 0) {
    return NextResponse.json([]);
  }

  const variantsToReturn = [];
  const postsToUpdate = new Set<string>();

  // 3. Process each due variant
  for (const variant of dueVariants) {
    let token = null;
    
    // LinkedIn and TikTok don't use OAuth tokens in this app:
    //   - LinkedIn: n8n uses a shared admin credential
    //   - TikTok: posts go through Buffer's own credential via n8n's Buffer node
    // For both, token stays null — no token_vault row exists for these accounts.
    if (variant.platform !== 'linkedin' && variant.platform !== 'tiktok') {
      try {
        token = await getDecryptedToken(variant.connected_account_id);
      } catch (e) {
        console.error(`Failed to get token for account ${variant.connected_account_id}`);
        // If a real Facebook/Instagram/YouTube token is genuinely missing/broken, skip this variant for now
        continue;
      }
    }

    variantsToReturn.push({
      postId: variant.post_id,
      variantId: variant.id,
      platform: variant.platform,
      caption: variant.caption,
      mediaUrls: variant.media_urls,
      title: variant.title,
      platformAccountId: (variant.connected_accounts as any).platform_account_id,
      token,
    });

    // Mark as publishing
    await supabase
      .from('post_variants')
      .update({ status: 'publishing' })
      .eq('id', variant.id);

    postsToUpdate.add(variant.post_id);
  }

  // 4. Update parent posts if all variants are publishing (or not pending)
  for (const postId of Array.from(postsToUpdate)) {
    const { data: allVariants } = await supabase
      .from('post_variants')
      .select('status')
      .eq('post_id', postId);

    if (allVariants && !allVariants.some(v => v.status === 'pending')) {
      await supabase
        .from('posts')
        .update({ status: 'publishing' })
        .eq('id', postId);
    }
  }

  return NextResponse.json(variantsToReturn);
}
