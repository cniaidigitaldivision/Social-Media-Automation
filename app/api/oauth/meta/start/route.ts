import { NextRequest, NextResponse } from 'next/server';
import { signState } from '@/lib/crypto';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const workspaceId = searchParams.get('workspace_id');

  if (!workspaceId) {
    return new Response('Missing workspace_id', { status: 400 });
  }

  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.META_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return new Response('Meta OAuth is not configured on the server', { status: 500 });
  }

  const nonce = crypto.randomBytes(16).toString('base64url');
  
  // 10 minute expiry
  const expiry = Date.now() + 10 * 60 * 1000;
  
  const payload = JSON.stringify({
    workspaceId,
    nonce,
    exp: expiry
  });

  const state = signState(payload);

  const scopes = [
    'pages_show_list',
    'pages_manage_posts',
    'pages_read_engagement',
    'business_management',
    'instagram_basic',
    'instagram_content_publish'
  ].join(',');

  const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
  authUrl.searchParams.set('client_id', appId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(authUrl.toString());
}
