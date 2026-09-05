import { NextRequest, NextResponse } from 'next/server';
import { verifyState, encrypt } from '@/lib/crypto';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  const errorReason = searchParams.get('error_reason');
  const errorDescription = searchParams.get('error_description');
  const stateParam = searchParams.get('state');
  const code = searchParams.get('code');

  // Handle Meta OAuth errors
  if (error || errorReason) {
    // If we have state, we can try to extract workspaceId to redirect back to it.
    let workspaceId = '';
    try {
      if (stateParam) {
        const payloadStr = verifyState(stateParam);
        const payload = JSON.parse(payloadStr);
        workspaceId = payload.workspaceId;
      }
    } catch (e) {
      // Ignore if state is invalid, we'll just redirect to a fallback or return an error
    }

    if (workspaceId) {
      const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts`, request.nextUrl.origin);
      redirectUrl.searchParams.set('oauth_error', errorDescription || errorReason || 'User denied access');
      return NextResponse.redirect(redirectUrl.toString());
    }
    
    return new Response(`OAuth Error: ${errorDescription || errorReason}`, { status: 400 });
  }

  if (!stateParam || !code) {
    return new Response('Missing state or code', { status: 400 });
  }

  let workspaceId = '';
  
  // Verify state
  try {
    const payloadStr = verifyState(stateParam);
    const payload = JSON.parse(payloadStr);
    
    if (Date.now() > payload.exp) {
      throw new Error('State expired');
    }
    
    workspaceId = payload.workspaceId;
  } catch (e) {
    return new Response('Invalid or expired state', { status: 400 });
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    return new Response('Meta OAuth is not configured on the server', { status: 500 });
  }

  try {
    // 1. Exchange code for short-lived token
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', appId);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('client_secret', appSecret);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      throw new Error(tokenData.error.message || 'Failed to exchange code');
    }

    const shortLivedToken = tokenData.access_token;

    // 2. Exchange short-lived token for long-lived user token
    const longTokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    longTokenUrl.searchParams.set('grant_type', 'fb_exchange_token');
    longTokenUrl.searchParams.set('client_id', appId);
    longTokenUrl.searchParams.set('client_secret', appSecret);
    longTokenUrl.searchParams.set('fb_exchange_token', shortLivedToken);

    const longTokenRes = await fetch(longTokenUrl.toString());
    const longTokenData = await longTokenRes.json();

    if (longTokenData.error) {
      throw new Error(longTokenData.error.message || 'Failed to get long-lived token');
    }

    const longLivedToken = longTokenData.access_token;

    // 3. Fetch user's pages
    const pagesUrl = new URL('https://graph.facebook.com/v19.0/me/accounts');
    pagesUrl.searchParams.set('fields', 'id,name,picture,instagram_business_account');
    pagesUrl.searchParams.set('access_token', longLivedToken);

    const pagesRes = await fetch(pagesUrl.toString());
    const pagesData = await pagesRes.json();

    if (pagesData.error) {
      throw new Error(pagesData.error.message || 'Failed to fetch pages');
    }

    const pages = pagesData.data || [];

    // 4. Store in database with a short expiration
    const supabase = await createClient();
    
    const pagesEncrypted = encrypt(JSON.stringify(pages));
    const tokenEncrypted = encrypt(longLivedToken);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const { data: sessionData, error: sessionError } = await supabase
      .from('oauth_sessions')
      .insert({
        workspace_id: workspaceId,
        pages_json: pagesEncrypted,
        user_token_encrypted: tokenEncrypted,
        expires_at: expiresAt
      })
      .select('id')
      .single();

    if (sessionError || !sessionData) {
      throw new Error('Failed to create session');
    }

    const sessionId = sessionData.id;
    
    // Set cookie with just the session ID reference
    const cookieStore = await cookies();
    cookieStore.set('meta_oauth_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60, // 10 minutes
      path: '/'
    });

    const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts/meta/select`, request.nextUrl.origin);
    return NextResponse.redirect(redirectUrl.toString());

  } catch (err: any) {
    const redirectUrl = new URL(`/workspaces/${workspaceId}/accounts`, request.nextUrl.origin);
    redirectUrl.searchParams.set('oauth_error', err.message || 'Authentication failed');
    return NextResponse.redirect(redirectUrl.toString());
  }
}
