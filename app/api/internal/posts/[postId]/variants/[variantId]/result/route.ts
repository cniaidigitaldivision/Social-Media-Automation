import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string; variantId: string }> }
) {
  const resolvedParams = await params;
  const { postId, variantId } = resolvedParams;

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

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { success, platformPostId, liveUrl, error } = body;
  const supabase = createClient();

  // 1. Update variant
  if (success) {
    await supabase
      .from('post_variants')
      .update({
        status: 'published',
        platform_post_id: platformPostId || null,
        live_url: liveUrl || null,
        published_at: new Date().toISOString(),
      })
      .eq('id', variantId);
  } else {
    // get current attempts
    const { data: currentVariant } = await supabase
      .from('post_variants')
      .select('attempts')
      .eq('id', variantId)
      .single();
      
    await supabase
      .from('post_variants')
      .update({
        status: 'failed',
        error: error || 'Unknown error',
        attempts: (currentVariant?.attempts || 0) + 1,
      })
      .eq('id', variantId);
  }

  // 2. Check and update parent post
  const { data: allVariants } = await supabase
    .from('post_variants')
    .select('status')
    .eq('post_id', postId);

  let postStatus = null;
  if (allVariants) {
    const isFinished = allVariants.every(v => v.status === 'published' || v.status === 'failed' || v.status === 'cancelled');
    if (isFinished) {
      const anySuccess = allVariants.some(v => v.status === 'published');
      postStatus = anySuccess ? 'published' : 'failed';
      await supabase
        .from('posts')
        .update({ status: postStatus })
        .eq('id', postId);
    }
  }

  return NextResponse.json({
    variantId,
    postId,
    variantStatus: success ? 'published' : 'failed',
    postStatus: postStatus,
  });
}
